// View is gonna be a singleton anyway.
var View = {}


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
    afterTyping: null,
    typing: false
  },
  methods: {
    search: null,
    logUp: null,
    logDown: null
  }
})


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
      course: i,
      description: `${i} is the best course ever`
    }
  })
}

View.Selector.showGenerator = function () {
  View.Generator.show()
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