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
                this.changeEditorMode(this.focus);
            }
        },
        clickCancel(label,event){
            //filetree.focus = name;
            var len = this.labelList.length;

            if (len==1){
                this.focus = '';
                this.labelList = [];
                filetree.focus = '';
                this.changeEditorMode(this.focus);
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
        //localStorage.clear();
        if (localStorage.length == 0 ){
            var File = [{ text: 'hello.cpp'}];

            insertItem('folderTree', JSON.stringify(File));
            insertItem('hello.cpp', "#include.....");
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
