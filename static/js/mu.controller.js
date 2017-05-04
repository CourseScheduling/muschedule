
function Controller () {
  this.stateMap = []
}



Controller.prototype.schedule_1 = function () {

  var start = performance.now()

  var sections = this.getSectionMap()
  var timeMap  = this.getTimeMap()

  var maxLength = sections.length
  var state = this.stateMap

  console.info('Scheduling prep took: ' + (performance.now() - start) + 'ms')
  
  function GoGoRecurse(m,t,w,r,f,count,state) {
    if (count == maxLength) {
      return 1
    }
    var count = 0
    var newSec = sections[count]

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


  console.info('Scheduling took: ' + (performance.now() - start) + 'ms')
}

// Tryna keep the controller stateless
Controller.prototype.getCourses = function () {
  return Mu.Model.sections
}




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