///////////////////////////////////////////////////////
// This is Joe's Amazing Scheduler/Scheduler Creator //
///////////////////////////////////////////////////////


// Scheduler design.


// Create some indexes.
// Params We're interested in:
//  - Time
//  - Density?

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


/*

// scheduling stack psuedo code:

// First Layer...
for (var i = 0; i < course1.mangled.length / timePercentage; i++) {
  
  // Set the week up.
  var m_1 = course1.mangled[i].time[0]
  var t_1 = course1.mangled[i].time[1]
  var w_1 = course1.mangled[i].time[2]
  var r_1 = course1.mangled[i].time[3]
  var f_1 = course1.mangled[i].time[4]

  // Middle Layer...
  for (var g = 0; g < course2.mangled.length / timePercentage; g++) {

    // Set the next week up.
    var m_2 = course2.mangled[g].time[0]
    var t_2 = course2.mangled[g].time[1]
    var w_2 = course2.mangled[g].time[2]
    var r_2 = course2.mangled[g].time[3]
    var f_2 = course2.mangled[g].time[4]


    // Check for intersections..
    var bad = (m_2 ^ m_1) || (t_2 ^ t_1) || (w_2 ^ t_1) || (r_1 ^ r_2) || (f_1 ^ f_2)
    if (bad) continue

    // Add this to the first for the next layer.

    m_2 |= m_1
    t_2 |= t_1
    w_2 |= w_1
    r_2 |= r_1
    f_2 |= f_1

    // Last Layer..
    for (var h = 0; h < course3.mangled.length / timePercentage; h++) {
      // We don't need to store the times since this is the last layer.
       var bad = ( m_2 ^ course3.mangled[h].time[0])
       || ( m_2 ^ course3.mangled[h].time[1])
       || ( m_2 ^ course3.mangled[h].time[2])
       || ( m_2 ^ course3.mangled[h].time[3])
       || ( m_2 ^ course3.mangled[h].time[4])

      if (bad) continue

      // This is the schedule that we found.
      var schedule = [i,g,h]

    }
  }
}

*/


























