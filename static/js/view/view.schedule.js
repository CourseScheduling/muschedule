var Schedule = new Vue({
  el: '#calendar',
  data: {
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
  },
  methods: {
    displayPrevious: null,
    displayNext: null
  }
})


Schedule.addSection = function (section) {
  var time = Mu.Model.timeMap[section.schedule]

  NextDay:
  for (var i = 0; i < 5; i++) {
    if (!time[i]) {
      continue
    }

    // If there's a interesect, add to it.
    for (var g = Schedule.days[i]; g--;) {
      var nT = Schedule.days[i].time
      if (nT & time[i]) {
        Schedule.days[i].time |= time[i]
        Schedule.days[i].sections.push(section)
        continue NextDay
      }
    }
    // No interesect, make a new group.
    Schedule.days[i].push({
      time: time[i],
      sections: [section]
    }) 
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

Schedule.displayPrevious = function() {
  console.log("displayPrevious")
}

Schedule.displayNext = function() {
  console.log("displayNext")
}
View.Schedule = Schedule