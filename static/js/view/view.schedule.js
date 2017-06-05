var Schedule = new Vue({
  el: '#calendar__left',
  data: {
    days: [
      [],
      [],
      [],
      [],
      []
    ],
    index: 0,
    maxIndex: 1
  },
  methods: {
    displayPrevious: null,
    displayNext: null
  }
})


Schedule.addSection = function (section, course, perm) {
  section.temporary = !perm
  section.active = true
  var time = course.schedules[section.schedule];
  section.time = time;
  var color = ColourGen.get(section.uniq)

  Outer:
  for (var i = 0; i < 5; i++) {
    if(!time[i]) {continue}

    //CREATING A STYLE OBJECT FOR SECTION
    var top = UTILS.getStart(time[i]);
    var height = UTILS.getHeight(time[i], top);

    height *= Mu.View.BLOCK_HEIGHT;
    top *= Mu.View.BLOCK_HEIGHT;
    var style = {
      top: top + "px",
      height: height + "px",
      left: 0 + "%",
      width: 100 + "%",
      backgroundColor: color
    };
    //ADDING {time:[], blocks:[]} TO DAYS, MODIFYING STYLES OF EXISTING BLOCKS IF NECESSARY
    for (var s = 0; s < this.days[i].length; s++) { //s : sectionblock
      var d = this.days[i][s]
      var dt = d.time;
      if (dt[i] & time[i])  {
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
  this.$forceUpdate()
}


Schedule.removeSection = function (section, perm) {
  // Go through all the days
  for (var i = 0; i < 5; i++) {
    // Go through all the groups.
    for (var s = this.days[i].length; s--;){
      // Go through all the blocks in a group.
      for (var n = this.days[i][s].blocks.length; n--;) {
        // If there is a collision, remove it. and recalculate the remaining blocks
        if (this.days[i][s].blocks[n].section.uniq == section.uniq) {
          this.days[i][s].blocks.splice(n,1)
          var d = this.days[i][s]
          console.log(d)
          
          //Unselect in control
          section.selected = false;   

          var time = [0,0,0,0,0];
          var numOverlappingSchedules = d.blocks.length;

          var width = 100 / (numOverlappingSchedules); 
          for (var sb = 0; sb < numOverlappingSchedules; sb++) {
            // Update the width and left of each style object
            // width in % (adding 1 because we're going to add another sectionblock)
            d.blocks[sb].style.width = width + "%";
            d.blocks[sb].style.left = (sb * width) + "%";

            //Update block.time
            sbTime = d.blocks[sb].section.time;
            for (var t= 0; t<5; t++) {
              time[t] |= sbTime[t];
            }
          }         
          //Remove block object if empty
          if (this.days[i][s].blocks.length == 0) {
            console.log("removing because empty");
            
            this.days[i].splice(s, 1);
          }

        }
      }
    }
  }
  View.Control.$forceUpdate();
  this.$forceUpdate()
}

Schedule.displayGenerated = function(days) {
  this.days = days;
  //Toggling selected to modify view in view.control
  for (var i = 0; i < 5; i++) {
    for (var j = days[i].length; j--;) {
      days[i][j].blocks[0].section.selected = true;
      console.log(days[i][j].blocks[0].section);
    }
  }
  View.Control.$forceUpdate();
}

Schedule.displayPrevious = function() {
  console.log("displayPrevious in main schedule")
}

Schedule.displayNext = function() {
  console.log("displayNex in main schedule")
}
View.Schedule = Schedule