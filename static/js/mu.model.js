//const API_URL = 'http://schedulerserver.azurewebsites.net/api/v1/ubc'
const API_URL = 'http://localhost:3000/api/v1/ubc'
function Model () {
  this.courses = []
  this.sections = []
  
  this.timeMap = {}
  this.timeArr = []

  this.oldTime = []
}

/** 
  - Grab courses from the API.
  @return Promise
*/
Model.prototype.getCourse = function (course) {
  return this._request({
    type: 'GET',
    url: '/course/' + course.replace(' ','_')
  })
}

/** 
  - Search for courses from the API
  @return Promise
*/
Model.prototype.searchCourses = function (query) {
  return this._request({
    type: 'GET',
    url: '/search/' + encodeURI(query)
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
  var self = this
  
  this.courses.push(course)
  var _transMap = {}

  // Aggregate schedules.
  course.schedules.forEach(function (schedule) {
    time = self.timeMap[schedule.join('.')]
    if (!time) {
      self.timeMap[schedule.join('.')] = self.timeArr.length
      _transMap[schedule.join('.')] = self.timeArr.length

      self.timeArr.push(schedule)
    } else {
      _transMap[schedule.join('.')] = time 
    }
  })
  console.log("course", course)
  // Change the section schedule values to the timeArr values.
  for(var term in course.terms) {
    var tSections = course.terms[term]
    for(var section in tSections) {
      console.log('tsections',tSections);
      // Go through each section in a term.
      tSections[section].forEach(function (sectionOfType) {
        // Go through each section in a Lab/ Lecture
        sectionOfType.forEach(function (section) {
          if (section) {
            section.schedule = _transMap[course.schedules[section.schedule].join('.')]
          }
        })
      })
    }
  }

  this.updateOld()
}


Model.prototype.updateOld = function () {
  var _convertOld = function (arr) {
    var oldTime = []
    for(var i = 0; i < 5; i++) {
      if (arr[i]) {
        var start = arr[i].toString(2).indexOf("1")
        var end = arr[i].toString(2).lastIndexOf("1")

        oldTime.push({
          day: i,
          start: (start * 30) + 480,
          end: (end * 30) + 480,
          length: ((end - start) * 30)
        })
      }
    }

    return oldTime
  }


  for(var i = this.oldTime.length; i < this.timeArr.length; i++) {
    this.oldTime.push(_convertOld(this.timeArr[i]))
  }
}

// Yet another Singleton
Mu.Model = Model = new Model()