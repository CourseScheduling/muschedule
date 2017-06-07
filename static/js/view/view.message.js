var RegisterTemplate = {
  template: '#register__template',
  props: '[sections]'
}

var Message = new Vue({
  el: '#message__container',
  data: {
    sections: [],
    message: ""
  }
  methods: {
    registerMessage: null
  },
  components: {
    'register__template': RegisterTemplate
  }
})

Message.registerMessage = function() {

}
