var Schedule = new Vue({
  el: '#calendar__left',
  data: {
    days: [
      [{
        time: [0,1,1,2,3]
        blocks: [
          {
            style: {},
            section: Section
          },
          {

          }
        ]
      },
      {

      }],
      [],
      [],
      [],
      []
    ]
  },
  methods: {

  }
})

Schedule.addSection = function (section, perm) {
  section.temporary = !perm
  var time = Mu.Model.timeMap[section.schedule]

  Outer:
  for (var i = 0; i < 5; i++) {
    if(!time[i]) {continue}

    for (var t = 0; t < this.days[i].length; t++) {
      var d = this.days[i][t]
      if (d[0] & time[0] || d[1] & time[1] || d[2] & time[2] || d[3] & time[3] || d[4] & time[4])  {
        
        continue Outer
      }
    }
  }
}


View.Schedule = Schedule


/*



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

 */