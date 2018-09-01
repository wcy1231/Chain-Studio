var express = require('express');
var path = require('path');
var app = express();
var multer = require('multer')

var upload= multer({dest:'upload/'});
var fs = require('fs');
var cp = require('child_process');

app.use(express.static('public'));

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

app.post('/compile', upload.single('file'), (req, res, next) => {
	post_cnt = (post_cnt + 1) % 100000;
	let post_cnt_local = post_cnt

	console.log('compile recv file:'+ post_cnt_local);
	let file_content = req.body.file;

	let s_path = `./tmp/${post_cnt_local}.cpp`
	let abi_path = `./tmp/${post_cnt_local}.abi`
	let wasm_path = `./tmp/${post_cnt_local}.wasm`
	fs.writeFileSync(s_path,file_content);

	//console.log(s_path)
	let cmdStr=`eosiocpp -o ${wasm_path} ${s_path}`;
	cp.exec(cmdStr, (err1,stdout1,stderr1) => {
		cmdStr=`eosiocpp -g ${abi_path} ${s_path}`;
		cp.exec(cmdStr, (err2,stdout2,stderr2) => {
			//res.send(stdout1+stderr1+stdout2+stderr2);

			//console.log(wasm_path)
			let wasm= fs.readFileSync(wasm_path);
			let abi = fs.readFileSync(abi_path,'utf-8');
			console.log(stderr1);
			console.log(stdout1);
			console.log(stderr2);
			console.log(stdout2);
			res.json({
				'abi':abi,
				'wasm':hex2a(wasm.toString('Hex'))
			})
			//res.send(ret)

			cp.exec(`rm -f ${s_path} ${abi_path} ${wasm_path}`)
		});

		//console.log(stderr);
	});
});


app.listen(8080, () => {
  console.log('listening on *:80');
});
