
function Controller () {

}



Controller.prototype.schedule = function () {

  var start = performance.now()

  var courses = this.getCourses()
  var timeMap = this.makeMap(courses)
  var course_length = courses.length
  var state = []

  console.info('Scheduling prep took: ' + (performance.now() - start) + 'ms')

  // The function to do the actual scheduling...
  function GoGoRecurse (m,t,w,r,f, state, counter) {
    // Terminating cond.
    if (counter >= course_length) {
      return true
    }

    // Grab next course map.
    // 

  }






  var start = performance.now()
  for(var s = courses[0].length; s--;) {
    var section = courses[0][s]
    var children = []
    state.push({
      section: section,
      children: children
    })
    var time = timeMap[section.schedule]
    GoGoRecurse(time[0], time[1], time[2], time[3], time[4], time[5], children, 1)
  }
  console.log('Scheduling took: ' + (performance.now() - start) + 'ms')
}

// Tryna keep the controller stateless
Controller.prototype.getCourses = function () {
  return Mu.Model.courses
}


