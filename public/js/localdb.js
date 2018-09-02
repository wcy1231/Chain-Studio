// localStorage
function insertItem(key, value){
    localStorage.setItem(key, value);
}

function getItem(key){
    return localStorage.getItem(key);
}

function getStorageList(){

}


Vue.use(LiquorTree);

var filelabel = new Vue({
    el:'#ws_tab',
    data:{
         labelList:[],
         focus:''
    },
    methods:{

        clickLabel(name){
            if (name!=filetree.focus){
                console.log("in");
                filetree.focus = name;
                editor.setValue(getItem(name),-1);
                this.focus = name;
                filetree.changeEditorMode(this.focus);
            }
        },
        clickCancel(label,event){
            //filetree.focus = name;
            var len = this.labelList.length;

            if (len==1){
                this.focus = '';
                this.labelList = [];
                filetree.focus = '';
                filetree.changeEditorMode(this.focus);
                editor.setValue("");
            }
            else{
                if (label == this.focus){
                    this.labelList.splice(len-1,1);
                    this.clickLabel(this.labelList[len-2]);
                }
                else{

                    var index = this.labelList.indexOf(label);
                    if (index != -1){
                        this.labelList.splice(index,1);
                    }
                }
            }

            event.stopPropagation();
        },
    }
})



//console.log(LiquorTree);
var filetree = new Vue({
	el: '#ft',
	data: {
		focus:'',
		newfileName:'undefined',
        creating:false,
		treeData : [
            //{ text: 'hello.cpp'}
		],
		treeOptions: {

      	}
 	},
 	created: function () {
        if (localStorage.length == 0 ){
            var File = [{ text: 'hello.cpp'},{text:'nervos.sol'}];

            insertItem('folderTree', JSON.stringify(File));
            /*
var eosDemo = 'using namespace eosio;\
class hello : public eosio::contract {\
  public:\
      using contract::contract;\

      /// @abi action \
      void hi( account_name user ) {\
         print( "Hello, ", name{user} );\
      }\
};\
EOSIO_ABI( hello, (hi) )';
*/

var eos_demo = '#include <eosiolib/eosio.hpp>\r\
using namespace eosio;\r\
\r\
class hello : public eosio::contract {\r\
  public:\r\
      using contract::contract;\r\
\r\
      /// @abi action \r\
      void hi( account_name user ) {\r\
         print( "Hello, ", name{user} );\r\
      }\r\
};\r\
\r\
EOSIO_ABI( hello, (hi));';
console.log(eos_demo);

var nervos_demo =
'pragma solidity 0.4.24;\r\
\r\
contract SimpleStore {\r\
    mapping (address => mapping (uint256 => string)) private records;\r\
    mapping (address => uint256[]) private categories;\r\
    \r\
\r\
event Recorded(address _sender, string indexed _text, uint256 indexed _time);\r\
    \r\
    function _addToList(address from, uint256 time) private {\r\
        categories[from].push(time);\r\
    }\r\
    \r\
    function getList()\r\
    public\r\
    view\r\
    returns (uint256[])\r\
    {\r\
        return categories[msg.sender];\r\
    }\r\
    \r\
    function add(string text, uint256 time) public {\r\
        records[msg.sender][time]=text;\r\
        _addToList(msg.sender, time);\r\
        emit Recorded(msg.sender, text, time);\r\
    }\r\
    function get(uint256 time) public view returns(string) {\r\
        \r\
        return records[msg.sender][time];\r\
    }\r\
}\r\
';

            insertItem('hello.cpp', eos_demo);
            insertItem('nervos.sol', nervos_demo);
        }
        this.initTree();

  	},
 	methods:{
        onFileSelected(name){
            console.log(name);
            if (filelabel.labelList.indexOf(name)== -1) //不存在
            {
                //console.log(editor.getValue());
                filelabel.labelList.push(name);
            }
            this.focus = name;
            editor.setValue(getItem(name),-1);
            filelabel.focus = name;
            this.changeEditorMode(this.focus);
            return getItem(name);
        },
    	initTree(){
    		//console.log(JSON.parse(localStorage.getItem("folderTree")));
    		this.treeData = JSON.parse(localStorage.getItem("folderTree"));
            //console.log(this.treeData);
            //console.log(editor);


            if (this.treeData.length>0){
                var t = this.treeData[0].text;

                filelabel.labelList.push(t);
                this.focus = t;
                editor.setValue(getItem(t),-1);
                filelabel.focus = t;
                this.changeEditorMode(this.focus);
                //console.log(this.treeData[0]);
            }

    		//console.log(this.treeData);
    	},

    	getData(str){
    		return localStorage.getItem(str);
    	},
    	createNewFile(){
    		//this.seen = true;
            this.creating = true;
    	},
      setFilename(){
          console.log(this.newfileName);
          for (var i = 0 ; i<this.treeData.length ;i++ ){
              if (this.newfileName == this.treeData[i].text){
                 alert("filename conflict");
                 return
              }
          }
          if (this.newfileName != undefined){
              var data = { text : this.newfileName};
              this.treeData.push(data);
              insertItem(this.newfileName,"//init");
              this.onFileSelected(this.newfileName);
              this.storage();
          }
          else{
              alert("null filename");
          }
          this.creating = false;
      },
    	storage(){
    		insertItem("folderTree", JSON.stringify(this.treeData));
    	},
      changeEditorMode(filename){
         var subs3 = filename.substr(filename.length-3,3);
         var subs4 = filename.substr(filename.length-4,4);
         console.log(subs3);
         if (subs3=='.js'){
            console.log(".js");
            editor.getSession().setMode("ace/mode/javascript");
         }
         else if (subs4=='.sol'){
            console.log(".sol");
            editor.getSession().setMode("ace/mode/golang");
         }
         else{
            console.log(".cpp");
            editor.getSession().setMode("ace/mode/c_cpp");
         }

 	    }
    }
});
