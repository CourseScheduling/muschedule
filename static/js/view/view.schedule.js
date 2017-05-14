var Schedule = new Vue({
  el: '#calendar',
  data: {
    term: TERM,
    days: [
      [],
      [],
      [],
      [],
      []
    ],
    tempDays: [
      [],
      [],
      [],
      [],
      []
    ]
  }
})


Schedule.addSection = function (section) {
  var time = Mu.Model.oldTime[section.schedule]
  var timeInt = Mu.Model.timeMap[section.section]

  DayLoop:
  for (var day = 0; day < 5; day++) {
    if(!time[day]) {
      continue
    }

    // Search for intersecting group.
    for(var i = tempDays[day].length;i--;) {
      var group = tempDays[day][i]
      if(group.int & time[day]) {
        group.int |= time[day]
        group.groups.push({
          time: time,
          section: section
        })
        continue DayLoop
      }
    }

    // Since there's no intersection make a new group.
    tempDays[day].push({
      groups: [{
        time: time,
        section: section
      }],
      int: time[day]
    })

  }
}

Schedule.removeSection = function (section) {
  var time = Mu.Model.oldTime[section.schedule]
  var timeInt = Mu.Model.timeMap[section.section]

  DayLoop:
  for (var day = 0; day < 5; day++) {
    if(!time[day]) {
      continue
    }

    // Search for intersecting group.
    for(var i = tempDays[day].length;i--;) {
      var group = tempDays[day][i]
      if(group.int & time[day]) {
        group.int |= time[day]
        group.section.push(section)
        continue DayLoop
      }
    }

  }
}



Schedule.add = function (time) {
  for (var day = 0; day < 7; day++) {
    var curDay = this.tempDays[day]
    var dayObj = {}

    // If there's a day item, add it. 
    if (time[day]) {
      // Find the starting position
      dayObj.start = 0
      for (var i = 0; i < 32; i++) {
        if ((time[day] >> i) & 1) break
      }
      dayObj.start = i

      for (i; i < 32; i++) {
        if ((time[day] >> i) & 1) break
      }
      dayObj.end = i
      dayObj.height = (dayObj.end - dayObj.start)

      curDay.push(dayObj)
    }
  }
}


View.Schedule = Schedule