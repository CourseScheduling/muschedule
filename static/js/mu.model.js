
function Model () {
  this.courses = []
  this.sections = []
  this.timeMap = []
}

/** 
  - Grab courses from the API.
  @return Promise
*/
Model.prototype.getCourses = function () {}

/** 
  - Search for courses from the API
  @return Promise
*/
Model.prototype.searchCourses = function () {}


/** 
  - To be called internally whenever a course is added to the list.
*/
Model.prototype._addCourse = function (course) {
  // Add to list.
  this.courses.push(course)
  
  var _transMap = {}

  // Add the course's schedule to the timeMap
  CourseLoop:
  for (var i = 0, ii = course.schedules.length; i < ii; i++) {
    var schedule = course.schedules[i]
    var scheduleStr = schedule.join('.')

    // Look to find a match, continue, if bad.
    for (var s = this.timeMap.length;s--;) { 
      if (this.timeMap[s].join('.') == scheduleStr) {
        _transMap[i] = s
        continue CourseLoop
      }
    }

    _transMap[i] = this.timeMap.length
    this.timeMap.push(schedule)
  }

  // Go through this course's sections and update times.
  for (var t = course.sections.length;t--;) {
    for (var s = course.sections[t].length;s--;) {
      course.sections[t][s].time = _transMap[course.sections[t][s].time] 
    }
  } 
}


// Yet another Singleton
Mu.Model = Model = new Model()