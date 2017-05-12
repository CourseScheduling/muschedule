
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
  
  function GoGoRecurse(m,t,w,r,f,count,state) {
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

//Takes the stateMap in tree form and converts it to an array [sch, sec]
Controller.prototype.convertToArray = function () {
  validSchedules = this.validSchedules;
  stateMap = this.stateMap;

  function recursiveHelper(stateObject, acc) {
    if (stateObject.children.length === 0) {      
      accCopy = acc.slice();
      accCopy.push([stateObject.sch, stateObject.sec]);
      validSchedules.push(accCopy);
      return;
    }

    acc.push([stateObject.sch, stateObject.sec])
    for (var i = 0; i < stateObject.children; i++) {      
      recursiveHelper(stateObject.children[i], acc);
    } 
    acc.pop()
  }

  for (var i = 0; i < stateMap.length; i++) {
    var acc = [];
    recursiveHelper(stateMap[i], acc);
  }

  console.log(validSchedules);
}


// Tryna keep the controller stateless
Controller.prototype.getSectionMap = function () {
  return Mu.Model.sections
}

Controller.prototype.getSections = function(termToSchedule) {
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

Controller.prototype.getSchedules = function(termToSchedule) {
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

Controller.prototype.getTermToSchedule = function() {
  return View.Control.term;
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