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
	
var fp = new Vue({
    el:'#ws_tab',
    data:{
         labelList:[]
    },
    methods:{

        clickLabel(e){
            console.log(e);
            if (e!=filetree.focus){
                filetree.focus = e;
                editor.setValue(getItem(e),-1);
            }
        }
    }
})

var op = new Vue({
    el:'#op',
    data:{

    },
    methods:{
    
    }
})    

//console.log(LiquorTree);
var filetree = new Vue({
	el: '#ft',
	data: {
		focus:'',
		seen: false,
		newfileName:'input your file name',
		treeData : [
            //{ text: 'hello.cpp'}
		],
		treeOptions: {
			
      	}
      	
 	},
 	created: function () {
        /*
    	console.log(localStorage);
    	//localStorage.clear();
    	if (localStorage.length == 0 ){
	    	var File = [{ text: 'hello.cpp'}];
	    	
	    	insertItem('folderTree', JSON.stringify(File));
	    	insertItem('hello.cpp', "#include.....");
    	}
        this.initTree();
        
    	//console.log(this.treeData);
        */
        
        if (localStorage.length == 0 ){
            var File = [{ text: 'hello.cpp'}];
            
            insertItem('folderTree', JSON.stringify(File));
            insertItem('hello.cpp', "#include.....");
        }
        this.initTree();

  	},
 	methods:{
        /*
 		onNodeSelected(node) { 
 			//console.log(editor.getValue(),this.focus); 
 			//insertItem(this.focus, editor.getValue());	
            console.log("before",editor);
    		if (fp.labelList.indexOf(node.text)== -1) //不存在
    		{
    			//console.log(editor.getValue());
    			fp.labelList.push(node.text);
            }
    		this.focus = node.text;
            editor.setValue(getItem(node.text),-1);
    		//editor.setValue(getItem(node.text));
            console.log("after",editor);
    		return getItem(node.text);
    		//this.storage();

    		//this.content = this.getData(node.type);
    		//console.log(this.content);
    	},
        */
        onFileSelected(name){
            console.log(name);
            if (fp.labelList.indexOf(name)== -1) //不存在
            {
                //console.log(editor.getValue());
                fp.labelList.push(name);
            }
            this.focus = name;
            editor.setValue(getItem(name),-1);
            return getItem(name);
        },
    	initTree(){


    		//console.log(JSON.parse(localStorage.getItem("folderTree")));
    		this.treeData = JSON.parse(localStorage.getItem("folderTree"));
            console.log(this.treeData);
            console.log(editor);
            if (this.treeData.length>0){
                var t = this.treeData[0].text;

                fp.labelList.push(t);
                this.focus = t;
                editor.setValue(getItem(t),-1)

                //console.log(this.treeData[0]);
            }

    		//console.log(this.treeData);
    	},
        
    	getData(str){
    		return localStorage.getItem(str);
    	},
    	createNewFile(){
    		this.seen = true;
    	},
    	storage(){
    		insertItem("folderTree", JSON.stringify(this.treeData));
    	},
    	confirmFileName(){
    		this.seen = false;
    		var newFile = {text : this.newfileName};
			this.treeData.push(newFile);
			//console.log(JSON.stringify(this.treeData));
			insertItem("folderTree", JSON.stringify(this.treeData));
			insertItem(this.newfileName, "//start "+ this.newfileName);
    	},
    	cancelCreateFile(){
    		this.seen = false;
    	}
 	}
});
   