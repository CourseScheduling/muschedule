///////////////////////////////////////////////////////
// This is Joe's Amazing Scheduler/Scheduler Creator //
///////////////////////////////////////////////////////


// Scheduler design.


// Create some indexes.
// Params We're interested in:
//  - Time
//  - Density

var Sections = []
var Courses = []
var TimeIndex = []

function indexBuild () {
  // A little subroutine to turn an array time to a number.
  var _fromTime = function (time) {
    var num = 0
    var sum = 0    

    // Increase num for every day that has a time.
    // Also add this day's thing to the sum
    time[0] && ((num++), (sum += time[0]))
    time[1] && ((num++), (sum += time[1]))
    time[2] && ((num++), (sum += time[2]))
    time[3] && ((num++), (sum += time[3]))
    time[4] && ((num++), (sum += time[4]))

    return sum / num
  }

  var worst = Infinity
  var best = -Infinity
  // Iterate through all the courses.
  for (var i = Courses.length; i--;) {
    var course = Courses[i].mangled

    // Through the mangled as well.
    for (var m = course.length; m--;) {
      var section = course[m]

      // Through each section in the mangled block.
      var sum = 0
      for (var s = section.length; s--;) {
        sum += _fromTime(section[s])
      }
    }
  } 
}



































