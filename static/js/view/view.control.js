
/* The control panel is on the right. */
var Control = new Vue({
  el: '#calendar__right',
  data: {
    query: "",
    results: [],
    courses: [],
    searchTimeout: null,
    loading: false
  }
})

Control.search = function () {
  var self = this

  // This is soo that if people are typing.
  // We only need make a request 200ms after they're done.
  this.loading = true

  clearTimeout(this.searchTimeout)
  this.searchTimeout = setTimeout(function () {
    if (!self.query.trim())
      return
    
    Mu.Model.searchCourses(self.query).then(function (results) {
      self.loading = false
      self.results = results
    }, function () {
      self.loading = false
    })
  }, 400)
}

Control.generate = function () {
  View.Generate.start()
}

View.Control = Control