
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
Model.prototype.getCourse = function (course) {
  return this._request({
    type: 'GET',
    url: '/courses/' + course.replace(' ','_')
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

Model.prototype.addCourse = function (course) {
  this.courses.push(course)
  
  // This map transitions things from the local course schedule arr to a bigger one.
  var _transMap = {}

  // Adding stuff to the timeMap.
  OuterLoop:
  for(var i = course.schedules.length; i--;) {
    var schedule = course.schedules[i]
    var scheduleStr = schedule.join('.')

    // Try to find this schedule in the timeMap
    for (var t = this.timeMap.length; t--;) {
      if (this.timeMap[t].join('.') == scheduleStr) {
        _transMap[i] = t
        continue OuterLoop
      }
    }

    // Add this schedule cuz it currently doesn't exist.
    _transMap[i] = this.timeMap.length
    this.timeMap.push(schedule)
  }

  // Update all the sections in this course.
  for(var term in course.terms) {
    for(var i = course.terms[term].sections.length; i--;) {
      var section = course.terms[term].sections[i]
      // Update his section's schedule
      section.schedule = _transMap[section.schedule]
    }
  }
}


// Yet another Singleton
Mu.Model = Model = new Model()