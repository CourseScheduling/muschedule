const UP = 38
const DOWN = 40
const ENTER = 13
var TERM = 't1'

/* The control panel is on the right. */
var Control = new Vue({
  el: '#calendar__right',
  data: {
    term: TERM,
    query: "",
    results: [],
    courses: [],
    searchTimeout: null,
    loading: false,
    current: -1
  },
  methods: {
    toggleTerm: null,
    select: null,
    newTemplate: null
  },

})

Control.toggleTerm = function (term) {
  TERM = term
  this.term = term
  View.Schedule.toggleTerm(term);
  this.$forceUpdate()
}

Control.search = function (e) {
  var self = this

  // Do this to make the blue hover thing go up and down.
  switch (e.keyCode) {
    case ENTER:
      if (this.current >= 0 && this.current < this.results.length) {
        if (!Mu.Model.contains(this.results[this.current].code)) {
          this.addCourse(this.results[this.current])
        }
        this.query = "";
        this.results = [];
        this.current = -1;
        this.loading = false;         
        

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
  Mu.Model.getCourse(course.code).then(function (course) {
    course = JSON.parse(course)
    course.colour = ColourGen.add(course.code)
    // Process the course
    Mu.Model.addCourse(course)
    course.active = true
    self.flushCourses()
    self.courses.push(course)

    //TEMP Preprocessing to fix term 2 indexes (going to be fixed in scraper)
    if (course.terms[1]) {
      numT1Sections = course.terms[0].sections.length;
      console.log("numT1Sections", numT1Sections);
      t2SectionMap = course.terms[1].sectionMap;
      for (var i = t2SectionMap.length; i--;) {
        for (var j = t2SectionMap[i].indices.length; j--;) {
          t2SectionMap[i].indices[j] -= numT1Sections;
        }
      }
    }



    // Vue can't auto-update maps.
    self.$forceUpdate()
  })
}

Control.flushCourses = function () {
  var self = this
  for (var course in this.courses[self.term]){
    this.courses[self.term][course].active = false
  }
}

Control.generate = function () {
  View.Generate.start()
}

Control.activeToggle = function (c) {
  c.active = !c.active
  this.$forceUpdate()
  // Vue can't auto-update maps.
  //this.$forceUpdate()
}

Control.showTemp = function (section, course, temp) {
  if (!section.selected) {
    section.added = true;
    View.Schedule.addSection(section, course, 0)
  }  
}

Control.removeTemp = function (section, course) {
  if (!section.selected) {
    section.added = false;
    View.Schedule.removeSection(section, course, 0)
  } 
}

Control.select = function(section) {
  console.log("Section selected", section);
  if (section.selected == true) return;
  if (!section.added) View.Schedule.addSection(section, 1);
  section.selected = true;
  section.added = true; 
  section.temporary = false
  this.$forceUpdate();
}

Control.delete = function (course) {
  console.log(course)
  delete this.courses[this.term][course.code]
}

Control.newTemplate = function() {
  //Delegate to View.Schedule
  View.Schedule.newTemplate();
}

View.Control = Control