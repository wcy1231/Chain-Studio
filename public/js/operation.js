function compile_code()
{
    term.writeln('start compiling...')

    filename = filelabel.focus
    //console.log(filename)
    let text = getItem(filename)
    let chain_name= chain.chain_name
    //console.log(text)

    var fm = new FormData();
    fm.append('file', text);
    fm.append('chain_name',chain_name)

    $.ajax({
        url: '/compile',
        type: 'POST',
        data: fm,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: (data) => {
            console.log(data);
            window.compile_res=data;
            if (data.error) {
              term.writeln('compile error!')
            } else {
              term.writeln('compile done')
            }
        },
        error: function(){
            console.log("communicate fail");
        }
    });
}

function deploy_code() {
    //console.log(compile_res.abi);
    //console.log(compile_res.wasm);
    if (compile_res.error) {
      term.writeln('Error: please compile before deploy')
      return
    }
    term.writeln('deploying')

    let chain_name= chain.chain_name
    if (chain_name === 'EOS' || chain_name === 'EOSJungle' || chain_name === 'ENU') {
      eos.transaction(eos => {
          eos.setcode(user_account.name,0,0,compile_res.wasm)
          eos.setabi(user_account.name, JSON.parse(compile_res.abi))
      }).then(rsp =>{
          console.log(rsp)
          term.writeln('http://dev.cryptolions.io/#tx:'+rsp.transaction_id)
      }).catch(err=>{
          console.log(err)
          err=JSON.parse(err)
          term.writeln('error:'+err['error']['what'])
      })
    }

    if (chain_name === 'Nervos') {
      let abi=JSON.parse(compile_res.abi)
	    let myContract = new nervos.appchain.Contract(abi)

	    const transaction = {
			  from: nervos.appchain.accounts.wallet[0].address,
			  privateKey: nervos.appchain.accounts.wallet[0].privateKey,
			  nonce: 999999,
			  quota: 1000000,
			  chainId: 1,
			  version: 0,
			  validUntilBlock: 999999,
			  value: '0x0',
			};

	    nervos.appchain.getBlockNumber()
			  .then(current => {
			    transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
			    // deploy contract
			    return myContract
			      .deploy({
			        data: compile_res.wasm,
			        arguments: [],
			      })
			      .send(transaction)
			  })
			  .then(txRes => {
			    if (txRes.hash) {
			      // get transaction receipt
			      term.writeln("http://microscope.cryptape.com/#/transaction/"+txRes.hash)
			      return nervos.listeners.listenToTransactionReceipt(txRes.hash)
			    } else {
			      throw new Error('No Transaction Hash Received')
			    }
			  }).then(res => {
			    const { contractAddress, errorMessage } = res
			    if (errorMessage) throw new Error(errorMessage)
			    console.log(`contractAddress is: ${contractAddress}`)
          term.writeln("http://microscope.cryptape.com/#/account/"+contractAddress)
			    _contractAddress = contractAddress
			    nervos.appchain.storeAbi(contractAddress, abi, transaction) // store abi on the chain
			  })

    }
}


new Vue({
  el: '#run_contract',
  data: {
    contract_name: 'eosio',
    func_list:{},

  },
  methods: {
    submit_contract(){
        let chain_name= chain.chain_name
        if (chain_name === 'EOS' || chain_name === 'EOSJungle' || chain_name === 'ENU') {
          eos.getAbi(this.contract_name).then(rsp =>{
              this.func_list = rsp.abi.structs
          })
        }

        if (chain_name === 'Nervos') {
            nervos.appchain.getAbi(this.contract_name).then(rsp =>{
                for (t=0; t< rsp.length;t++) {
                    rsp[t].fields= rsp[t].inputs
                }
                this.func_list = rsp
                window.tmp = rsp
            })
        }
    },
    exec_func(name, fields){
        console.log(name,fields)
        var param={}
        for (idx in fields) {
            var field = fields[idx]
            param[field.name]=field.input
        }

        console.log(param)
        eos.transaction(this.contract_name, contract => {
            contract[name](param,{authorization:[user_account.name]})
        }).then(rsp =>{
            console.log(rsp)
            term.writeln("http://dev.cryptolions.io/#tx:"+rsp.transaction_id)
        }).catch(err=>{
            console.log(err)
            //err=JSON.parse(err)
            //term.writeln('error:'+err['error']['what'])
        })
    },
    is_func_list_empty(){
        console.log(JSON.stringify(this.func_list)=="{}");
        return (JSON.stringify(this.func_list)=="{}")
    }
  }

})


var chain = new Vue({
  el: '#chooseChain',
  data:{
    chain_list:['EOS','EOSJungle','ENU','Nervos'],
    chain_name:''
  },
  created(){
    this.chain_name = this.chain_list[1];
  },
  methods:{

    getChain(){
      return this.chain_name;
    }
  }
})
