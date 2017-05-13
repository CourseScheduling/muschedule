
const API_URL = 'http://schedulerserver.azurewebsites.net/api/v1/ubc'

function Model () {
  this.courses = []
  this.t1SectionSchedules = []
  this.t1Sections = []
  this.t2SectionSchedules = []
  this.t2Sections = []
}

/** 
  - Grab courses from the API.
  @return Promise
*/
Model.prototype.getCourse = function (course) {
  var self = this;
  return this._request({
    type: 'GET',
    url: '/courses/' + course.replace(' ','_')
  }).then(function(course) {
    return self._addCourse_1(course);
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


Model.prototype._addCourse_1 = function(course) {
  function addScheduleSections(course, term, sectionSchedules, sections) {
    types = course.terms[term].types;
    for (var i = 0; i < types.length; i ++) {
      sections.push(course.terms[term].sections[types[i]]);
      sectionSchedules.push(course.terms[term].schedules[types[i]])
    }
  } 


  course = JSON.parse(course)[0];

  //Removing waiting list from course object
  for (var term in course.terms) {
    if (course.terms[term].types.length > 0) {
      delete course.terms[term].sections['Waiting List'];
      delete course.terms[term].schedules['Waiting List'];
    }
    


    types = course.terms[term].types;
    index = types.indexOf('Waiting List');
    if (index > -1) {
      types.splice(index, 1);
    }
    index = types.indexOf('Workshop');
    if (index > -1) {
      types.splice(index, 1);
    }
  }

  //Adding schedules and sections to Model (used for scheduling)
  addScheduleSections(course, 't1', this.t1SectionSchedules, this.t1Sections);
  addScheduleSections(course, 't2', this.t2SectionSchedules, this.t2Sections);

    
  console.log(this); 
  return course;
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

Model.prototype.getSchedules = function() {
  var termToSchedule = View.Control.term;

  switch(termToSchedule) {
    case 't1':
      return Mu.Model.t1SectionSchedules;
      break;
    case 't2':
      return Mu.Model.t2SectionSchedules;
      break;
    case 't3':
      //TODO
      break;
  }
}

Model.prototype.getSections = function() {
  var termToSchedule = View.Control.term;
  switch(termToSchedule) {
    case 't1':
      return Mu.Model.t1Sections;
      break;
    case 't2':
      return Mu.Model.t2Sections;
      break;
    case 't3':
      //TODO
      break;
  }
}

// Yet another Singleton
Mu.Model = Model = new Model()