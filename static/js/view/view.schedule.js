var BLOCK_HEIGHT = 20;

var Schedule = new Vue({
  el: '#calendar__left',
  data: {
    days: [
      [],
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
  console.log("Adding section");
  var time = Mu.Model.timeArr[section.schedule]

  Outer:
  for (var i = 0; i < 5; i++) {
    if(!time[i]) {continue}

    //CREATING A STYLE OBJECT FOR SECTION
    //Getting the top value
    var top = 0;
    for (var top = 0; top < 32; top++) {
      if ((time[i] >> top) & 1) break
    }
    height = top;
    //Getting the height value
    for (height; height < 32; height++) {
      if (!(time[i] >> height) & 1) break
    }
    height = height - top;
    height *= BLOCK_HEIGHT;
    top *= BLOCK_HEIGHT;
    var style = {
      top: top + "px",
      height: height + "px",
      left: 0 + "%",
      width: 100 + "%"
    };
    console.log(time);
    console.log(style);
    console.log(this.days[i]);
    //ADDING {time:[], blocks:[]} TO DAYS, MODIFYING STYLES OF EXISTING BLOCKS IF NECESSARY
    for (var s = 0; s < this.days[i].length; s++) { //s : sectionblock
      var d = this.days[i][s]
      var dt = d.time;
      if (dt[i] & time[i])  {
        console.log("Intersection found");
        // | each day in time
        for (var t = 0; t < 5; t++) {
          dt[t] |= time[t];
        }
        // Update the width and left of each style object 
        var numOverlappingSchedules = d.blocks.length;
        var width = 100 / (numOverlappingSchedules + 1); // width in % (adding 1 because we're going to add another sectionblock)
        for (var sb = 0; sb < numOverlappingSchedules; sb++) {
          d.blocks[sb].style.width = width + "%";
          d.blocks[sb].style.left = (sb * width) + "%";
        }
        //Add section and add the {style, section} to blocks
        style.left = (numOverlappingSchedules * width) + "%";
        style.width = width + "%";
        console.log("Pushing section to block aggregate");
        d.blocks.push({
          style: style,
          section: section
        })
        continue Outer
      } 
    }
    //Add new {time:[], blocks:[]} object
    console.log("Pushing section to new block");
    this.days[i].push({
      time: time,
      blocks: [{
        style: style,
        section: section 
      }]
    })
  }
}

Schedule.removeSection = function (section, perm) {
  console.log("removing section", section);
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

/*
{
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

      }
*/

//CPSC 210 103 MWF 2-3 and STAT 200 103 MWT 2-3 overlap