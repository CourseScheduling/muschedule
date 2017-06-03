
function Controller () {
  this.validSchedules = [];
}



Controller.prototype.schedule_2 = function () {
  var start = performance.now();
  var self = this;
  var courses = Mu.Model.courses;
  var term = View.Control.term;
  var lockedSections = View.Generate.lockedSections;




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
