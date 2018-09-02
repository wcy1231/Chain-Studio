var candy = "2074a27ea494ffb23350d9f721133f4f4a2de551";


$.post("https://developers.vnt.link/chaincode/query",
        JSON.stringify({
        "channel":"mychannel",
        "ccName":"chaincode_example02",
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJKdGkiOiIxMTQ5NzkifQ.5ERN44vbFdU7UmpVvysD1xCV82Q0eUfAlUYqtpumLIk",
        "fcn":"query",
        "args":["1"]
        }),
    function(data_buyer,status){
        console.log("buyer",data_buyer);
        console.log("buyer",data_buyer.payload);

});

//var
/*
$.post("https://developers.vnt.link/chaincode/userdeploy",
        JSON.stringify({
        "file":"./chaincode_example02.tar.gz"
        "user":"mychannel",
        "ccName":"chaincode_example02",
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJKdGkiOiIxMTQ5OTEifQ.lnS2l0KEddc9j1Nhjje9zmKN_-D_DyEqUbkTaqZOqDo",
        "fcn":"query",
        "args":["1"],
        "true":
        }),
    function(data_buyer,status){
        console.log("buyer",data_buyer);
        console.log("buyer",data_buyer.payload);

})
*/
/*
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
*/
