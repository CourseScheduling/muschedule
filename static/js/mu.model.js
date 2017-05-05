
const API_URL = 'http://schedulerserver.azurewebsites.net/api/v1/ubc'

function Model () {
  this.courses = []
  this.sections = []
  this.timeMap = []
}

/** 
  - Grab courses from the API.
  @return Promise
*/
Model.prototype.getCourse = function (c) {
  return this._request({
    type: 'GET',
    url: '/courses?c=' + course
  })
}

/** 
  - Search for courses from the API
  @return Promise
*/
Model.prototype.searchCourses = function (query) {
  return this._request({
    type: 'GET',
    url: '/courseList/search/' + encodeURI(query)
  })
}


/**
 * A promisified request function. To be used internally.
 * @param  {JSON} opts - {
 *                         type : {String} - The type of request, defaults to 'GET',
 *                         url  : {String} - The URL to make a request to
 *                         data : {JSON}   - a JSON data to send. For post requests
 *                       }
 * @return {Promise}
 */
Model.prototype._request = function (opts) {
  var data = ""
  for (var key in opts.data) {
    data += (key + '=' + encodeURI(opts.data[key]))
  }


  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open(opts.type || 'GET', API_URL + opts.url, true)
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response)
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        })
      }
    }
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      })
    }
    xhr.send()
  })
}


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