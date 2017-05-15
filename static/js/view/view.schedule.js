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


    //CREATING A STYLE OBJECT FOR SECTION
    //Getting the top value
    var top = 0;
    for (var top = 0; top < 32; i++) {
      if ((time[i] >> top) & 1) break
    }
    height = top;
    //Getting the height value
    for (height; height < 32; height++) {
      if ((time[i] >> height) & 1) break
    }
    height = height - top;
    top *= cellHeight;
    height *= cellHeight;
    var style = {
      top: top,
      height: height,
      left: 0,
      width: 100
    };

    //ADDING {time:[], blocks:[]} TO DAYS, MODIFYING STYLES OF EXISTING BLOCKS IF NECESSARY
    for (var s = 0; s < this.days[i].length; s++) { //s : sectionblock
      var d = this.days[i][s]
      var dt = d.time;
      if (dt[0] & time[0] || dt[1] & time[1] || dt[2] & time[2] || dt[3] & time[3] || dt[4] & time[4])  {
        // | each day in time
        for (var t = 0; t < dt.length; i++) {
          dt[t] |= time[t];
        }
        // Update the width and left of each style object 
        var numOverlappingSchedules = d.blocks.length;
        var width = 100 / (numOverlappingSchedules + 1); // width in % (adding 1 because we're going to add another sectionblock)
        for (var sb = 0; sb < numOverlappingSchedules; i++) {
          d.blocks[sb].style.width = width;
          d.blocks[sb].style.left = sb * width;
        }
        //Add section and add the {style, section} to blocks
        style.left = numOverlappingSchedules * width;
        style.width = width;

        d.blocks.push({
          style: style,
          section: section
        })
        continue Outer
      } else {
        //Add new {time:[], blocks:[]} object
        d.blocks.push({
          time: time,
          blocks: [style]
        })
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