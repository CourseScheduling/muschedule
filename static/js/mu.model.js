const API_URL = 'http://schedulerserver.azurewebsites.net/api/v1/ubc'
//const API_URL = 'http://localhost:3000/api/v1/ubc'
//const API_URL = 'http://ec2-34-211-121-5.us-west-2.compute.amazonaws.com:3000/api/v1/ubc'
//const API_URL = 'http://40.86.179.55:3000/api/v1/ubc'
function Model () {
  this.courses = []
  this.courselist = []
}
/**
  - Grab courselist from the API.
  @return Promise
*/

Model.prototype.getCourselist = function() {
  var self = this;
  var start = performance.now();
  this._request({
    type: 'GET',
    url: '/courselist'
  }).then(courselist => {
    console.log("Fetching courselist took: ", performance.now() - start);
    cl = JSON.parse(courselist);

    self.courselist = cl;
  });
}

Model.prototype.getMatchingCourses = function(query) {
  //For now - brute force - later use some binary search or smth
  if (!query) return [];

  var results = [];
  for (var i = 0; i < this.courselist.length; i++) {
    if (this.courselist[i][0].startsWith(query.toUpperCase())) {
      results.push({
        'code':this.courselist[i][0],
        'name':this.courselist[i][1]
      });
      if (results.length == 5) break;
    }
  }
  return results;
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
  //Updating section.time
  for (term in course.terms) {
    sections = course.terms[term].sections
    sections.forEach(section => {
      section.time = course.schedules[section.schedule];
    });
  }
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
Model.getCourselist();