
function Controller () {
  this.validSchedules = [];
}

// The Joe Thomas implementation of the scheduling algorithm.
Controller.prototype.schedule_1 = function () {
  var courses = Mu.Model.courses
  // chunks the array of all mangled course arrays. 
  var chunks = courses.map(course => course.mangled)
  chunks.sort((a,b) => (a.length - b.length))

  var chunk_length = chunks.length
  // The actual recursive function
  function DFS(m,t,w,r,f, count, tree) {

    // Fetch a chunk.
    var chunk = chunks[count++]

    // Go through mangled schedules.
    for (var i = chunk.length; i--;) {
      var time = chunk[i]

      // Check for time collisions.
      if (time[0]&m || time[1]&t || time[2]&w || time[3]&r || time[4]&f) {
        continue
      }

      // Push this as the next thing, and recurse down.
      if (count == chunk_length) {
        tree.push({
          name: chunk.name,
          index: i
        })
      } else {
        var children = []
        tree.push({
          name: chunk.name,
          index: i,
          children: children
        })

        DFS(time[0]|m, time[1]|t, time[2]|w, time[3]|r, time[4]|f, count, children)
      }
    }
  }

  // Start the scheduling.
  var tree = []
  DFS(0,0,0,0,0,0,tree)
  return tree
}


Controller.prototype.schedule_2 = function () {
  var start = performance.now();
  var self = this;
  courses = Mu.Model.courses;
  var term = View.Control.term;
  var lockedSections = View.Generate.lockedSections;
  //Filtering lockedSections
/*  var filteredCoursesMap = [];
  for (var i = lockedSections.length; i--;) {
    for (var j = courses.length; j--;) {
      if (courses[j].code !== lockedSections[i].code) continue;
      filteredMangled = [];
      typeIndex = lockedSections[i].type;
      //Filter out all the mangled with out this section
      for (var k = courses[j].mangled.length; k--;) {
        if (courses[j].mangled[k][typeIndex] == lockedSections[i].schedule) {
          filteredMangled.push(courses[j].mangled[k];
        }
      }
      filteredCourse = [j, courses[j].mangled] //[course, originalMangled]
      filteredCoursesMap.push(filteredCourse)
      courses[j].mangled = filteredMangled;
    }
  }

  //TODO: Move this to the end
  //Reverting filtered changes
  for (var i = filteredCoursesMap.length; i--) {
    courses[filteredCoursesMap[0]].mangled = filteredCoursesMap[1];
  }*/

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

    var termObject = courses[count].terms.find((termObject) => { return 't'+termObject.name == term });
    var mangled = termObject.mangled;    

    for (var i = mangled.length; i--;) {
      //Creating a aggregate time array from mangled indexes
      var time = [0,0,0,0,0];
      var oneMangledCombo = mangled[i];
      for (var l = oneMangledCombo.length; l--;) {
        mangledTime = courses[count].schedules[termObject.sections[oneMangledCombo[l]].schedule]
        for (var t = 0; t < 5; t++) {
          time[t] |= mangledTime[t]
        }
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
  console.log("breaks",breaks);
  recursiveSchedule(breaks[0],breaks[1],breaks[2],breaks[3],breaks[4],0,acc);
  console.info('Scheduling took: ' + (performance.now() - start) + 'ms')
  console.log(self.validSchedules);



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
