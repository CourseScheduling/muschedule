const UP = 38
const DOWN = 40
const ENTER = 13

/* The control panel is on the right. */
var Control = new Vue({
  el: '#calendar__right',
  data: {
    term: TERM,
    query: "",
    results: [],
    courses: {},
    searchTimeout: null,
    loading: false,
    current: -1
  }
})

Control.search = function (e) {
  var self = this

  // Do this to make the blue hover thing go up and down.
  switch (e.keyCode) {
    case ENTER:
      if (this.current >= 0 && this.current < this.results.length) {
        this.addCourse(this.results[this.current])
      }
    case UP:
    case DOWN:
      this.current = (this.current + (e.keyCode == UP? -1: 1)) % this.results.length

      clearTimeout(this.searchTimeout) 
      this.loading = false
      e.preventDefault()
      return
  }

  // This is soo that if people are typing.
  // We only need make a request 200ms after they're done.
  this.loading = true

  clearTimeout(this.searchTimeout)
  this.searchTimeout = setTimeout(function () {
    if (!self.query.trim()) {
      self.loading = false
      self.results = []
      self.current = -1
      return
    }
    
    Mu.Model.searchCourses(self.query).then(function (results) {
      self.loading = false
      self.results = JSON.parse(results).slice(0,5)
      self.current = -1
    }, function () {
      self.loading = false

    })
  }, 400)
}

Control.addCourse = function (course) {
  var self = this

  Mu.Model.getCourse(course[0]).then(function (course) {
    course = JSON.parse(course)[0]

    // Process the course
    Mu.Model.addCourse(course)
    course.active = true
    self.flushCourses()
    self.courses[course.code] = course

    // Vue can't auto-update maps.
    self.$forceUpdate()
  })
}

Control.flushCourses = function () {
  for (var course in this.courses){
    this.courses[course].active = false
  }
}

Control.generate = function () {
  View.Generate.start()
}

Control.activeToggle = function (c) {
  c.active = !c.active
  // Vue can't auto-update maps.
  this.$forceUpdate()
}

Control.showTemp = function (section, course) {
  Mu.View.Schedule.addSection(section)
}

Control.removeTemp = function (section, course) {
  Mu.View.Schedule.removeSection(section)
}

View.Control = Control