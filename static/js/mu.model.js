const API_URL = 'http://schedulerserver.azurewebsites.net/api/v1/ubc'
//const API_URL = 'http://localhost:3000/api/v1/ubc'
function Model () {
  this.courses = []
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
}


Model.prototype.contains = function(courseCode) {
  for (var i = this.courses.length; i--;) {
    if (this.courses[i].code == courseCode) return true;
  }
  return false;
}

Model.prototype.removeCourse = function(course) {
  console.log("removing course in model");
  for (var i = this.courses.length; i--;) {
    if (this.courses[i].code == course.code) {
      this.courses.splice(i, 1);
      return;
    }
  }
}

// Yet another Singleton
Mu.Model = Model = new Model()