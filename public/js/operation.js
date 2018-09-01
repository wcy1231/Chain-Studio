function compile_code()
{
    term.writeln('start compiling...')

    filename = filelabel.focus
    //console.log(filename)
    var text = getItem(filename)
    //console.log(text)

    var fm = new FormData();
    fm.append('file', text);

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
            term.writeln('compile done')
        },
        error: function(){
            console.log("communicate fail");
        }
    });
}

function deploy_code() {
    //console.log(compile_res.abi);
    //console.log(compile_res.wasm);
    term.writeln('deploying')
    eos.transaction(eos => {
        eos.setcode(user_account.name,0,0,compile_res.wasm)
        eos.setabi(user_account.name, JSON.parse(compile_res.abi))
    }).then(rsp =>{
        console.log(rsp)
        term.writeln('tid:'+rsp.transaction_id)
    }).catch(err=>{
        console.log(err)
        err=JSON.parse(err)
        term.writeln('error:'+err['error']['what'])
    })
}


new Vue({
  el: '#run_contract',
  data: {
    contract_name: 'eosio',
    func_list:{},

  },
  methods: {
    submit_contract(){
        eos.getAbi(this.contract_name).then(rsp =>{
            this.func_list = rsp.abi.structs
        })
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
            term.writeln('tid:'+rsp.transaction_id)
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
