var term = new Terminal({
  cols: 100,
  rows: 7,
  //cursorBlink: 5,
  //scrollback: 3,
  //tabStopWidth: 4
});
term.open(document.getElementById('terminal'));
//term.setOption('theme','blue')
//term.focus()