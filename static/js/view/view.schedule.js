var Schedule = new Vue({
  el: '#calendar',
  data: {
    days: [
      [],
      [],
      [],
      [],
      []
    ]
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