// This is a mutable 'constant'
var COLORS = ['#1BA1E2', '#E51400', '#393', '#F09609', '#A200FF', '#E671B8', '#FF0097', '#8CBF26', '#00ABA9']
// View is gonna be a singleton anyway.
var View = {}


document.body.addEventListener('click', function () {
  View.Selector.courses.forEach(c => {
    c.active = false
  })
})
//////////////////////////////////////////////
// View Logic for the main scheduling thing //
//////////////////////////////////////////////

View.SchedulePlate = new Vue({
  data: {
    sections: [],
    groups: [
      [],[],[],[],[]
    ]
  },
  methods: {
    addSection: null
  }
})



View.SchedulePlate.addSection = function (section) {
  // Look for an intersection for everyday.
  for (var i = 0; i < 7; i++) {
    if(this.groups[i].time & section.schedule.m) {
      // Find the group this fits in with.
      
    } else {
      // If there's no intersection, insert it as a new group.
      this.groups[i].push(section)
    }

    // Update the group time.
    this.groups[i].time |= section.schedule.m
  }
}




/////////////////////////////////////////////////
// View Logic for the Course Selector / Search //
/////////////////////////////////////////////////

View.Selector = new Vue({
  el: '#control__wrap',
  data: {
    query: "",
    results: [],
    courses: JSON.parse(localStorage['Courses']||'[]'),
    afterTyping: null,
    typing: false,
    term: 1,
  },
  methods: {
    swapTerm: null,
    search: null,
    logUp: null,
    logDown: null,
    addCourse: null
  }
})

View.Selector.setTerm = function (num) {
  this.term = num
}

View.Selector.logUp = function () {
  setTimeout(function () {
    this.typing = false
  }, 200)
}

View.Selector.logDown = function () {
  var self = this
  this.typing = true
}

View.Selector.search = function () {
  var query = this.query.trim()
  
  console.log(query )
  if (!query) {
    this.results = []
    return
  }

  // Calculate every 500ms or when the person stops typing. Whichever comes first.
  this.results = (this.query).split('').slice(0,5).map((i) => {
    return {
      code: i,
      name: `${i} is the best course ever`
    }
  })
}

View.Selector.showGenerator = function () {
  View.Generator.show()
}

View.Selector.addCourse = function (course) {
  for (var i = this.courses.length; i--;) {
    if (this.courses[i].code == course.code) {
      return
    }
  }
  course.color = COLORS.pop()
  course.active = false
  this.courses.push(course)
  localStorage['Courses'] = JSON.stringify(this.courses)
}

View.Selector.activate = function (course) {
  course.active = true
}

//////////////////////////////////////////
// View Logic for the Generator Loading //
//////////////////////////////////////////

View.Generator = new Vue({
  el: '#gen__wrap',
  data: {
    visible: false,
    loading: false,
    number: 100000
  }
})

View.Generator.show = function () {
  this.visible = true
  this.loading = true
}