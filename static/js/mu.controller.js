
function Controller () {
  this.stateMap = []
  this.validSchedules = [];
}



Controller.prototype.schedule_1 = function () {

  var start = performance.now()

  //var sections = this.getSectionMap()
  //var timeMap  = this.getTimeMap()
  var termToSchedule = this.getTermToSchedule();
  var sections = this.getSections(termToSchedule);
  var schedules = this.getSchedules(termToSchedule);


  console.log(sections);
  console.log(schedules);

  var maxLength = sections.length
  var state = this.stateMap
  console.log(maxLength);

  console.info('Scheduling prep took: ' + (performance.now() - start) + 'ms')
  
  function GoGoRecurse(m,t,w,r,f,count, acc) {
    if (count == maxLength) {
      //console.log("maxLength");
      return 1
    }    
    var newSec = schedules[count]

    //console.log(state);
    for(var i = newSec.length; i--;) {
      // Skip all the collisions
      var time = newSec[i]
      if (time[0]&m || time[1]&t || time[2]&w || time[3]&r || time[4]&f) {
        continue
      }

      var children = []
      state.push({
        sec: count,
        sch: i,
        children: children
      })

      var good = GoGoRecurse(time[0]|m, time[1]|t, time[2]|w, time[3]|r, time[4]|f, count + 1, children)

      if (!good) {              
        state.pop()
      } else {
        count = 1
      }
    }

    return count
  }

  GoGoRecurse(0,0,0,0,0,0,state);
  console.info(state);
  console.info('Scheduling took: ' + (performance.now() - start) + 'ms')
}


Controller.prototype.schedule_2 = function () {
  var start = performance.now();
  var self = this;
  var schedules = Mu.Model.getSchedules();

  var maxLength = schedules.length;
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

    var newSec = schedules[count];
    

    for (var i = newSec.length; i--;) {
      
      var time = newSec[i];
      if (time[0]&m || time[1]&t || time[2]&w || time[3]&r || time[4]&f) {
        continue
      }   
      acc.push([count, i]);   
      if (!recursiveSchedule(time[0]|m, time[1]|t, time[2]|w, time[3]|r, time[4]|f, count+1, acc)) return 0;
      acc.pop();
    }  
    return 1; 
  }


  var acc = [];
  recursiveSchedule(0,0,0,0,0,0,acc);
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
// 
// 
// 
// section_1 -> [1,2,3]
// section_2 -> [4,5,6]
// section_3 -> [7,8,9]
// 
// 
// 
//  
//    4 7
//      8
//      9
//  1 5
//      7
//      8
//      9
//    6
//      7
//      8
//      9
//    
//    
//    
//    
//    4 7
//      8
//      9
//  2 5
//      7
//      8
//      9
//    6
//      7
//      8
//      9