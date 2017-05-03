
/* The control panel is on the right. */
var Control = new Vue({
  el: '#calendar__right',
  data: {
    query: "",
    results: [],
    courses: []
  }
})

Control.generate = function () {
  View.Generate.start()
}

View.Control = Control