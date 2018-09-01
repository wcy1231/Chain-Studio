ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/onedark");
editor.getSession().setMode("ace/mode/c_cpp");

editor.$blockScrolling = Infinity;
editor.setFontSize(14);
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
