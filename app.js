var express = require('express');
var path = require('path');
var app = express();
var multer = require('multer')

var upload= multer({dest:'upload/'});
var fs = require('fs');
var cp = require('child_process');

app.use(express.static('ace/build/src'));
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
  //res.render('index',{ins_in:req.query.ins});
  //console.log("ins:%s",req.query.ins);
});


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
    	if (hex.substr(i, 2) === '00') {
    		str +='\0'
    	} else {
        	str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    	}
    return str;
}

var post_cnt = 0

function procEos (post_cnt_local, file_content) {

}


app.post('/compile', upload.single('file'), (req, res, next) => {
	post_cnt = (post_cnt + 1) % 100000;
	let post_cnt_local = post_cnt

	console.log('compile recv file:'+ post_cnt_local);
	let file_content = req.body.file;
  let chain_name = req.body.chain_name;

  if (chain_name === 'EOS' || chain_name ==='EOSJungle' || chain_name ==='ENU') {
    let s_path = `./tmp/${post_cnt_local}.cpp`
  	let abi_path = `./tmp/${post_cnt_local}.abi`
  	let wasm_path = `./tmp/${post_cnt_local}.wasm`
  	fs.writeFileSync(s_path,file_content);

  	//console.log(s_path)
  	let cmdStr=`eosiocpp -o ${wasm_path} ${s_path}`;
  	cp.exec(cmdStr, (err1,stdout1,stderr1) => {
  		cmdStr=`eosiocpp -g ${abi_path} ${s_path}`;
  		cp.exec(cmdStr, (err2,stdout2,stderr2) => {
        try {
  			     var wasm= fs.readFileSync(wasm_path);
  			     var abi = fs.readFileSync(abi_path,'utf-8');
        } catch (e) {
          res.json({
    				'abi':'',
    				'wasm':'',
            'chain_name':chain_name,
            'error':true
    			})
          cp.exec(`rm -f ${s_path} ${abi_path} ${wasm_path}`)
          return
        }

  			console.log(stderr1);
  			console.log(stdout1);
  			console.log(stderr2);
  			console.log(stdout2);
  			res.json({
  				'abi':abi,
  				'wasm':hex2a(wasm.toString('Hex')),
          'chain_name':chain_name
  			})
  			cp.exec(`rm -f ${s_path} ${abi_path} ${wasm_path}`)
  		});
  	});
    return
  }

  if (chain_name === 'Nervos'  || chain_name === 'ETH') {
    let s_path = `./tmp/${post_cnt_local}.sol`
  	fs.writeFileSync(s_path,file_content);

    let cmdStr=`solcjs --bin ${s_path} -o ./tmp`;
    cp.exec(cmdStr, (err1,stdout1,stderr1) => {
      cmdStr=`solcjs --abi ${s_path} -o ./tmp`;
      cp.exec(cmdStr, (err2,stdout2,stderr2) => {

        cmdStr=`ls tmp/__tmp_${post_cnt_local}_sol*.bin`;
        cp.exec(cmdStr, (err3,stdout3,stderr3) => {
            let wasm_path = './'+stdout3
            wasm_path=wasm_path.substr(0,wasm_path.length - 1)
            console.log(wasm_path)

            cmdStr=`ls tmp/__tmp_${post_cnt_local}_sol*.abi`;
            cp.exec(cmdStr, (err4,stdout4,stderr4) => {
                let abi_path = './'+stdout4
                abi_path=abi_path.substr(0,abi_path.length - 1)
                console.log(abi_path)
                try {
                    var abi = fs.readFileSync(abi_path,'utf-8');
                    var wasm= fs.readFileSync(wasm_path);
                } catch (e) {
                  res.json({
            				'abi':'',
            				'wasm':'',
                    'chain_name':chain_name,
                    'error':true
            			})
                  cp.exec(`rm -f ${s_path} ${abi_path} ${wasm_path}`)
                  return
                }

                res.json({
                  'abi':abi,
                  'wasm':hex2a(wasm.toString('Hex')),
                  'chain_name':chain_name
                })
                cp.exec(`rm -f ${s_path} ${abi_path} ${wasm_path}`)
              })
        })

      });
    });
    return
  }

  res.json({
    'abi':'',
    'wasm':'',
    'chain_name':chain_name
  })

});


app.listen(80, () => {
  console.log('listening on *:80');
});
