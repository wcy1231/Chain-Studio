var term = new Vue({
  el: '#terminal_text',
  data: {
    text: '',
  },
  methods: {
    writeln(t){
      this.text += t + '\n'
    }
  }
})
