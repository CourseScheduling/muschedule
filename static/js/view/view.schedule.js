var Schedule = new Vue({
  el: '#calendar',
  data: {
    LEN_CONV: {},
    term: TERM,
    days: [
      [],
      [],
      [],
      [],
      []
    ],
    temp: [
      [],
      [],
      [],
      [],
      []
    ]
  }
})


// Hacky, should be replaced later.
'.'.repeat(30).split('').map((a,i) => {
  Schedule.LEN_CONV[(i*30) + 480] = i*20
})

Schedule.addSection = function (section) {
  var time = Mu.Model.oldTime[section.schedule]
  var self = this
  time.forEach(function (timeBlock) {
    self.temp[timeBlock.day] = {
      time: timeBlock,
      section: section
    }
  })
  
  self.$forceUpdate()
}

Schedule.removeSection = function (section) {
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