function compile_code()
{
    term.writeln('start compiling...')
    var text = editor.getValue();
    //alert(text);    

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
            //$("#t1").text(data);
            //eos.setabi('eosjunglewcy', JSON.parse(data))
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