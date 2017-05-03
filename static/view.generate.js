
var Generate = new Vue({
  el: '#gen__wrap',
  data: {
    visible: false
  },
  methods: {
    toggleVisible: null
  }
})


Generate.toggleVisible = function () {
  this.visible = !this.visible
}

View.Generate = Generate