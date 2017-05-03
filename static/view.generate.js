
var Generate = new Vue({
  el: '#gen__wrap',
  data: {
    visible: false,
    loading: true,
    schedules: [],
    courseMap: {},
    maxNumber: ""
  },
  methods: {
    start: null,
    halt:  null
  }
})

/** Simply turns the generator screen on. Also checks for scheduling. */
Generate.start = function () {
  this.visible = true

  if (!this.schedules.length) {
    this.loading = true
    Controller.schedule()
  }

  this.courseMap = Controller.genCourseMap()
  this.schedules = Controller.grabTen()

  this.loading = false
}

/** Simply stops the entire generator. Also does other stuff. */
Generate.halt = function () {
  this.visible = false
}


View.Generate = Generate