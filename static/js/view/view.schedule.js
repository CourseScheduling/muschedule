var Schedule = new Vue({
  el: '#calendar__left',
  data: {
    templates: {
      "t1":[
        [ [], [], [], [], [] ], //One template
      ],
      "t2":[
        [ [], [], [], [], [] ], //One template
      ]    
    },
    index: 0,
    maxIndex: 1,
    term: 't1'
  },
  methods: {
    displayPrevious: null,
    displayNext: null
  }
})


Schedule.addSection = function (section, course, perm) {
  days = this.templates[this.term][this.index];
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
    for (var s = 0; s < days[i].length; s++) { //s : sectionblock
      var d = days[i][s]
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
    days[i].push({
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
  days = this.templates[this.term][this.index];
  // Go through all the days
  for (var i = 0; i < 5; i++) {
    // Go through all the groups.
    for (var s = days[i].length; s--;){
      // Go through all the blocks in a group.
      for (var n = days[i][s].blocks.length; n--;) {
        // If there is a collision, remove it. and recalculate the remaining blocks
        if (days[i][s].blocks[n].section.uniq == section.uniq) {
          days[i][s].blocks.splice(n,1)
          var d = days[i][s]
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
          if (days[i][s].blocks.length == 0) {
            console.log("removing because empty");
            
            days[i].splice(s, 1);
          }

        }
      }
    }
  }
  View.Control.$forceUpdate();
  this.$forceUpdate()
}

Schedule.displayGenerated = function(days) {
  this.templates[this.term][this.index] = days;
  //Toggling selected to modify view in view.control
  for (var i = 0; i < 5; i++) {
    for (var j = days[i].length; j--;) {
      days[i][j].blocks[0].section.selected = true;
    }
  }
  View.Control.$forceUpdate();
  this.$forceUpdate();
}


function resetSectionsInDays(days) {
  //Setting all currently scheduled sections locked and selected to false
  for (var i = 0; i < 5; i++) {
    for (var j = days[i].length; j--;) {
      days[i][j].blocks[0].section.selected = false;
      days[i][j].blocks[0].section.locked = false;
    }
  }
}
function prepareDays(currentDays, days) {
  //Setting all currently scheduled sections locked and selected to false
  for (var i = 0; i < 5; i++) {
    for (var j = currentDays[i].length; j--;) {
      currentDays[i][j].blocks[0].section.selected = false;
      currentDays[i][j].blocks[0].section.locked = false;
    }
  }

  //Setting all sections.selected to true (we set locked later when generate is clicked)
  for (var i = 0; i < 5; i++) {
    for (var j = days[i].length; j--;) {
      days[i][j].blocks[0].section.selected = true;
    }
  }
}

Schedule.displayPrevious = function() {
  console.log("displayPrevious in main schedule")
  currentDays = this.templates[this.term][this.index];
  index = (this.index - 1) % this.maxIndex;
  if (index == -1) index = maxIndex - 1;
  this.index = index;
  prepareDays(currentDays, this.templates[this.term][this.index])
  View.Control.$forceUpdate();
}

Schedule.displayNext = function() {
  console.log("displayNex in main schedule")
  currentDays = this.templates[this.term][this.index];
  this.index = (this.index + 1) % this.maxIndex;
  prepareDays(currentDays, this.templates[this.term][this.index]);
  View.Control.$forceUpdate();
}

Schedule.newTemplate = function () {
  console.log("Adding new template");
  var currentDays = this.templates[this.term][this.index];
  resetSectionsInDays(currentDays)
  var newTemplateDays = [ [], [], [], [], []];
  this.templates[this.term].push(newTemplateDays);

  this.index = this.templates[this.term].length-1;
  this.maxIndex = this.templates[this.term].length;
  View.Control.$forceUpdate();
}

Schedule.currentDays = function() {
  return this.templates[this.term][this.index];
}

Schedule.toggleTerm = function(term) {
  this.term = term;
  this.index = 0;
  this.maxIndex = this.templates[this.term].length;
  this.$forceUpdate();
}
View.Schedule = Schedule