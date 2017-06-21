const UP = 38
const DOWN = 40
const ENTER = 13
var TERM = 't1'
var listenersRegistered = false;

/* The control panel is on the right. */
var Control = new Vue({
  el: '#calendar__right',
  data: {
    term: TERM,
    query: "",
    results: [],
    courses: {
      't1': [],
      't2': []
    },
    courseList: [],
    loading: false,
    current: -1
  },
  methods: {
    toggleTerm: null,
    select: null,
    newTemplate: null,
    register: null,
    removeCourse: null,
  },

})

//Get all courses
//After not typing for a bit, update the top 5 courses

Control.toggleTerm = function (term) {
  TERM = term
  this.term = term
  View.Schedule.toggleTerm(term);
  this.$forceUpdate()
}


Control._reset = function() {
  this.query = "";
  this.results = [];
  this.current = -1;
} 
Control.search = function (e) {
  var self = this

  // Do this to make the blue hover thing go up and down.
  switch (e.keyCode) {
    case ENTER:
      if (this.current >= 0 && this.current < this.results.length) {
        if (!this._contains(this.results[this.current].code)) {
          this.addCourse(this.results[this.current])
        }
        this._reset();

      }
    case UP:
    case DOWN:
      this.current = (this.current + (e.keyCode == UP? -1: 1)) % this.results.length
      e.preventDefault()
      return
  }
  
  // Retrieves up to 5 courses from Model.courselist
  this.results = Mu.Model.getMatchingCourses(self.query);
  self.current = -1;
}

Control._contains = function(courseCode) {
  for (var i = this.courses[this.term].length; i--;) {
    if (this.courses[this.term][i].code == courseCode) return true;
  }
  return false;
}
Control.addCourse = function (course) {
  var self = this
  start = performance.now();
  console.log("Getting course");
  Mu.Model.getCourse(course.code).then(function (course) {
    console.log("received course. took: ", performance.now() - start);
    course = JSON.parse(course)
    course.colour = ColourGen.add(course.code)
    // Process the course
    Mu.Model.addCourse(course)
    course.active = true
    self.flushCourses()
    self._reset()
    self.courses[self.term].push(course)

    // Vue can't auto-update maps.
    self.$forceUpdate()
  })
}

Control.flushCourses = function () {
  var self = this
  //console.log(this.courses);
  this.courses[self.term].forEach(course => {
    course.active = false;
  });
}

Control.generate = function () {
  View.Generate.start();
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


Control.newTemplate = function() {
  //Delegate to View.Schedule
  View.Schedule.newTemplate();

}

Control.register = function() {
  if (!listenersRegistered) {
    //Changing color with js for now. Might be able to do this in pure css
    document.addEventListener('click', (e) => {
      if(e.target && e.target.classList.contains('section__link')) {
        e.target.previousSibling.style.color = 'green';
      }
    });
    listenersRegistered = true;
  }


  //Displays popup with link to sections
  var sectionList = [];
  template = View.Schedule.templates[this.term][View.Schedule.index];
  for (var i = template.length; i--;) {
    for (var j = template[i].length; j--;) {
      blocks = template[i][j].blocks;
      blocks.forEach(sb => {
        if (!sectionList.includes(sb.section.uniq))  sectionList.push(sb.section.uniq);
      });
    }
  }

  var html = "";
  linkTemplate = document.getElementById("section__linkWrap").cloneNode(true);
  linkTemplate.style.display = 'table';

  sectionList.forEach(section => {
    linkElement = linkTemplate.getElementsByTagName('a')[0];
    sectionSplit = section.split(" ");
    linkElement.innerHTML = section;
    linkElement.href = `https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=5&dept=${sectionSplit[0]}&course=${sectionSplit[1]}&section=${sectionSplit[2]}`;
    html += linkTemplate.outerHTML;
  });

  swal({
    title: 'Click and register!',
    html: html,
    confirmButtonText: 'Done',
  })
}



Control.removeCourse = function(course) {
  console.log("Removing course", course)
  View.Schedule.removeCourse(course);
  Mu.Model.removeCourse(course);
  for (var i = this.courses[this.term].length; i--;) {
    if (this.courses[this.term][i].code == course.code) {
      this.courses[this.term].splice(i, 1);
      return;
    }
  }

}
View.Control = Control