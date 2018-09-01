var nervos_config={
			chain:"http://121.196.200.225:1337",
			privateKey:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
		}

const nervos = Nervos(nervos_config.chain)
const account = nervos.appchain.accounts.privateKeyToAccount(nervos_config.privateKey)
nervos.appchain.accounts.wallet.add(account) // add account to nervos

nervos.appchain
    .getBlockNumber()
    .then(current => {
    	console.log(current)
      })
