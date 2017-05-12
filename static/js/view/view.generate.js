var Generate = new Vue({
  el: '#gen__wrap',
  data: {
    visible: false,
    loading: true,
    schedules: [],
    courseMap: {},
    maxNumber: "",
    days: [
      [],
      [],
      [],
      [],
      []
    ],
    tempDays: [
      [],
      [],
      [],
      [],
      []
    ]
  },
  methods: {
    start: null,
    halt:  null,
    displayPrevious: null,
    displayNext: null
  }
})

/** Simply turns the generator screen on. Also checks for scheduling. */
Generate.start = function () {
  this.visible = true

  if (!this.schedules.length) {
    this.loading = true
    Mu.Controller.schedule_1()
    //Mu.Controller.convertToArray();
  }



  this.loading = false
}

/** Simply stops the entire generator. Also does other stuff. */
Generate.halt = function () {
  this.visible = false
}
Generate.displayNext = function() {
  console.log("displaynext in Generate")
}

Generate.displayPrevious = function() {
  console.log("displayPrevious in Generate")
}

View.Generate = Generate