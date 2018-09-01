ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/onedark");
editor.getSession().setMode("ace/mode/c_cpp");

//editor.container.style.background= rgb(15,15,15);
editor.container.classList.add("myEditor");
editor.$blockScrolling = Infinity;
editor.setFontSize(13);
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
