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
  time = course.schedules[section.schedule]; //used when removing section
  section.time = time;
  color = ColourGen.get(section.uniq)
 

  // Go through all the days.
  Outer:
  for (var i = 0; i < 5; i++) {
    if(!time[i]) continue;

    style = Mu.View.style(time[i], color);

    //Go through each blocks/time wrap and add section if there is an overlap
    for (var s = days[i].length; s--; ) {
      sb = days[i][s]
      if (sb.time & time[i]) {
        sb.time |= time[i];
        sb.blocks.push({
          style: style,
          section: section
        })
        continue Outer;
      }
    }

    //If no overlaps are found, add new
    days[i].push({
      time: time[i],
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
  section.selected = false;
  //Find section in blocks, update time and remove
  // Go through all the days
  for (var i = 0; i < 5 ; i++) {
    // Go through all the groups.
    for (var s = days[i].length; s--;) {
      // Go through all the blocks in a group.
      var sb = days[i][s];
      for (var n = sb.blocks.length; n--;) {
        if (sb.blocks[n].section.uniq == section.uniq) {
          sb.blocks.splice(n, 1);

          sb.time = sb.blocks.reduce((acc, sb) => {
            return acc | sb.section.time[i];
          }, 0);

          if (sb.blocks.length == 0) {
            days[i].splice(s, 1);            
          }          
        }
      }
    }
  }
  View.Control.$forceUpdate();
  this.$forceUpdate();
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
      for (var k = days[i][j].blocks.length; k--;) {
        days[i][j].blocks[k].section.selected = false;
        days[i][j].blocks[k].section.locked = false;
      }
      
    }
  }
}
function prepareDays(currentDays, days) {
  //Setting all currently scheduled sections locked and selected to false
  this.resetSectionsInDays(currentDays);

  //Setting all sections.selected to true (we set locked later when generate is clicked)
  for (var i = 0; i < 5; i++) {
    for (var j = days[i].length; j--;) {
      for (var k = days[i][j].blocks.length; k--;) {
        days[i][j].blocks[k].section.selected = true;
      }
    }
  }
}

Schedule.displayPrevious = function() {
  currentDays = this.templates[this.term][this.index];
  index = (this.index - 1) % this.maxIndex;
  if (index == -1) index = this.maxIndex - 1;
  this.index = index;
  prepareDays(currentDays, this.templates[this.term][this.index])
  View.Control.$forceUpdate();
}

Schedule.displayNext = function() {
  currentDays = this.templates[this.term][this.index];
  this.index = (this.index + 1) % this.maxIndex;
  prepareDays(currentDays, this.templates[this.term][this.index]);
  View.Control.$forceUpdate();
}

Schedule.newTemplate = function () {
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