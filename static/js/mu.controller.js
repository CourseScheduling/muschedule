
function Controller () {
  this.validSchedules = [];
}

Controller.prototype._filter = function(courses, lockedSections, filteredCourseMap, term) {
  //Filtering lockedSections
  for (var i = courses.length; i--;) {
    for (var l = lockedSections.length; l--; ) {
      if (lockedSections[l].code == courses[i].code) {
        ls = lockedSections[l];
        termObject = courses[i].terms[term];
        index = termObject.sections.findIndex(section => {
          return section.uniq == ls.uniq;
        })
        filteredMangled = termObject.mangled.filter(combo => {
          return combo[ls.type] == index 
        });
        filteredCourseMap.push([termObject, termObject.mangled]);
        termObject.mangled = filteredMangled;
      }
    }
  }

}

Controller.prototype._restore = function(filteredCourseMap) {
  for (var i = filteredCourseMap.length; i--;) {
    filteredCourseMap[i][0].mangled = filteredCourseMap[i][1];
  }
}

Controller.prototype.schedule_2 = function () {
  var start = performance.now();
  var self = this;
  courses = Mu.Model.courses;
  var term = View.Control.term;
  var lockedSections = View.Generate.lockedSections;
  var filteredCourseMap = [];

  this._filter(courses, lockedSections, filteredCourseMap, term);

  this.validSchedules = [];
  var breaks = View.Generate.breaks;

  var maxLength = courses.length;
  var numSchedules = 0;
  function recursiveSchedule(m, t, w, r, f, count, acc) {
    if (count == maxLength) {
      self.validSchedules.push(acc.slice());
      numSchedules++;
      if (numSchedules == 1000) {
        return 0;
      }
      return 1;
    }

    var termObject = courses[count].terms[term];
    var mangled = termObject.mangled;    

    for (var i = mangled.length; i--;) {
      //Creating a aggregate time array from mangled indexes
      var time = [0,0,0,0,0];
      var oneMangledCombo = mangled[i];
      for (var l = oneMangledCombo.length; l--;) {
        mangledTime = courses[count].schedules[termObject.sections[oneMangledCombo[l]].schedule]
        mangledTime.forEach((element, index) => {
          time[index] |= element
        });
      }

      //Checking collisions
      if (time[0]&m || time[1]&t || time[2]&w || time[3]&r || time[4]&f) {
        continue
      }   

      acc.push({
        courseIndex: count,
        mangledCombo: mangled[i]
      });   
      if (!recursiveSchedule(time[0]|m, time[1]|t, time[2]|w, time[3]|r, time[4]|f, count+1, acc)) return 0;
      acc.pop();
    }  
    return 1; 
  }


  var acc = [];
  recursiveSchedule(breaks[0], breaks[1] , breaks[2], breaks[3], breaks[4],0,acc);
  console.info('Scheduling took: ' + (performance.now() - start) + 'ms')

  this._restore(filteredCourseMap);



}



// Tryna keep the controller stateless
Controller.prototype.getSectionMap = function () {
  return Mu.Model.sections
}

Controller.prototype.getSchedule = function(index) {
  return this.validSchedules[index];
}

// Yet another Singleton
Mu.Controller = Controller = new Controller()

