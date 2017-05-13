const UP = 38
const DOWN = 40
const ENTER = 13

/* The control panel is on the right. */
var Control = new Vue({
  el: '#calendar__right',
  data: {
    query: "",
    results: [],
    courses: [],
    searchTimeout: null,
    loading: false,
    current: -1,
    term: 't1'
  }
})

Control.search = function (e) {
  var self = this

  // Do this to make the blue hover thing go up and down.
  switch (e.keyCode) {
    case ENTER:
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
    //course = JSON.parse(course)[0]
    course.active = true
    //self.wrangle(course)
    self.flushCourses()
    self.courses.push(course)
  })
}

Control.flushCourses = function () {
  for (var i = this.courses.length; i--;){
    this.courses[i].active = false
  }
}

Control.generate = function () {
  View.Generate.start()
}

Control.activeToggle = function (c) {
  console.log(c)
  c.active = !c.active
}

Control.wrangle = function (course) {
  // We gotta do some deduping here
  // Should be done server side...
  var typeArr = course.types.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
  })
  course.typeArr = typeArr
  course.secMap = {}
  // Create a set object with all the sections..
  for(var i = 0, ii = typeArr.length; i < ii; i++) {
    var secType = typeArr[i]
    course.secMap[secType] = []
  }

  // Go through all the sections and update the map
  for(var i = 0; i < course.sections.length; i++) {
    var section = course.sections[i]
    course.secMap[section.activity_type].push(section)
  }
}


Control.showTemp = function (section, course) {
  //Mu.View.Schedule.add(course.terms[this.term].schedules[section.activity_type][section.schedule])
}

Control.removeTemp = function (section, course) {
  //Mu.View.Schedule.remove(course.terms[this.term].schedules[section.activity_type][section.schedule])
}

Control.changeTerm = function(term) {
  switch (term) {
    case 1:
      term = 't1';
      break;
    case 2:
      term = 't2';
      break;
    case 3:
      break;
  }
  this.term = term;
  //Toggle highlight
}



View.Control = Control
