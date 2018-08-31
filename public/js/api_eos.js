		document.addEventListener('scatterLoaded', scatterExtension => {
        const scatter = window.scatter;
        //console.log(window.scatter);
        window.scatter = null; 
        scatter.requireVersion(3.0);

        const eosNetwork = {
	        protocol: "http",
	        blockchain: 'eos',
	        host: 'api-mainnet.starteos.io',
	        port: 80, 
	        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	    }

        const eosJungleNetwork = {
            protocol: "http",
            blockchain: 'eos',
            host: 'jungle.cryptolions.io',
            port: 18888, 
            chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
        }

        scatter.getIdentity({accounts: [eosJungleNetwork]}).then(identity => {
                    const account = identity.accounts.find(acc => acc.blockchain === 'eos');
                    window.user_account = account

                }).catch(error => {
                    console.log(error);
                });

        const eosOptions = {}
        const eos = scatter.eos(eosJungleNetwork, Eos, eosOptions);
        window.eos = eos

    })
