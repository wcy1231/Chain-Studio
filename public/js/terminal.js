var term = new Vue({
  el: '#terminal_text',
  data: {
    text: '',
  },
  methods: {
    writeln(t){
      var textdiv = document.getElementById("terminal_text");
      var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
      var url = t.match(reg);
      console.log(url);
      if (url!=null){
        textdiv.innerHTML += '<a href="'+t+'">'+t+'</a><br>';
      }
      else{
        textdiv.innerHTML += t + '<br>';
      }
      textdiv.scrollTop = textdiv.scrollHeight;


      //this.text += t + '\n'
    }
  }
})
