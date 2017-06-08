var breakTable = [];
for (var i = 0; i < 28; i++) {
  this.breakTable.push({"0":false, "1":false, "2":false, "3":false, "4":false});
}
var initializedMouseupListener = false;

var Generate = new Vue({
  el: '#gen__wrap',
  data: {
    visible: false,
    loading: true,
    maxNumber: "",
    days: [
      [],
      [],
      [],
      [],
      []
    ],
    schedules: [],
    index: 0,
    maxIndex: 0,
    breakTable: breakTable,
    breaks: [0,0,0,0,0],
    lockedSections: [],
    mousedown: false,
    addBreak: true,
    rescheduleTimeout: null
  },    
  methods: {
    start: null,
    halt:  null,
    displayPrevious: null,
    displayNext: null,
    select: null,
    lockSection: null,
    triggerLower: null
  },
  watch: {
    breakTable: {
      handler: function(after, before) {
      },
      deep: true
    }
  }
})





Generate.triggerLower = function(event) {
  console.log("trigger lower");
  switch (event.type) {
    case "mousedown":
      mouseX = event.pageX;
      mouseY = event.pageY;
      var underlyingCell = document.elementsFromPoint(mouseX, mouseY).find((element) => {
        return element.classList.contains("cal__block--data")
      });
      event.target.parentElement.style.pointerEvents = "none";  //target is bubbled to span not the div
      this.addBreak = true; //Always going to be the case    
      this.mousedown = true;  
      break;
    case "mouseenter":
      if (this.addBreak == true) event.target.style.pointerEvents = "none";
      break;
    default:
      break;
  }
  
}

Generate.toggleBreak = function(event) {
  var self = this;
  function updateBreaks (target) {
    console.log("updating breaks")
    attributes = target.attributes;
    dataTime = attributes["data-time"].value;
    dataDay = attributes["data-day"].value; 
    console.log(self.addBreak);
    self.breakTable[dataTime][dataDay] = self.addBreak;
    mask = 1 << dataTime;
    if (self.addBreak) self.breaks[dataDay] |= mask;
    else self.breaks[dataDay] &= ~mask;
  }
  if (!initializedMouseupListener) {
    //Initialize onmouseup listener once
    document.onmouseup = function() {
      if (self.mousedown == true) self.rescheduleTimeout = setTimeout(self.restart.bind(self), 1000);
      self.mousedown = false;  
      initializedListener = true;  
    }
  }
  switch (event.type) {
    case "mousedown":
      clearTimeout(self.rescheduleTimeout);
      attributes = event.target.attributes;
      dataTime = attributes["data-time"].value;
      dataDay = attributes["data-day"].value;
      breakTableData = self.breakTable[dataTime][dataDay];
      breakTableData ? self.addBreak = false : self.addBreak = true;
      updateBreaks(event.target);
      self.mousedown = true;
      break;
    case "mouseover":
      if (self.mousedown) updateBreaks(event.target);
      break;
    default:
      break;
  }
  //console.log(event);
}


Generate.lockSection = function(section, event) {
  console.log("Lock section triggered");
  event.preventDefault();
  lockedSections = this.lockedSections;
  var self = this;

  if (section.locked) {
    for (var i = lockedSections.length; i--;) {
      //Toggling locked
      if (lockedSections[i].uniq == section.uniq) {
        lockedSections.splice(i, 1);
        section.locked = false;
        break;
      }
    }
  } else {
    section.locked = true;
    lockedSections.push(section);
  }     
  self.restart();
  return false;
}


/** Adds sections to data.days 
  Kind of like a trimmed down version of addSEction in view.schedule.js
*/
Generate._updateDays = function(scheduleToRender, courses) {
  var term = View.Control.term;

  for (var i = 0; i < scheduleToRender.length; i++) {
    //Getting the section
    mangledCombo = scheduleToRender[i].mangledCombo;
    course = courses[scheduleToRender[i].courseIndex];

    for (var ml = mangledCombo.length; ml--; ) {
      var section = course.terms.find((termObject) => { return 't'+termObject.name == term }).sections[mangledCombo[ml]]
      var time = course.schedules[section.schedule];      
      var color = ColourGen.get(section.uniq);

      //Add to days if there is a section on this day
      for (var t = 0; t < 5; t++) {
        if (!time[t]) continue;

        var top = UTILS.getStart(time[t]);
        var height = UTILS.getHeight(time[t], top);
        height *= Mu.View.BLOCK_HEIGHT;
        top *= Mu.View.BLOCK_HEIGHT;

        var style = {
          top: top + "px",
          height: height + "px",
          left: 0 + "%",
          width: 100 + "%",
          backgroundColor: color
        }

        this.days[t].push({
          blocks:[{
            style:style,
            section: section
          }],
          time: time
        })
      }
    }    
  }
};


Generate.draw = function(index) {
  this.days = [
      [],
      [],
      [],
      [],
      []
    ];
  var scheduleToRender = Mu.Controller.getSchedule(this.index);
  var courses = Mu.Model.courses;
  this._updateDays(scheduleToRender, courses);
  this.maxIndex = Mu.Controller.validSchedules.length;
}

/** Simply turns the generator screen on. Also checks for scheduling. */
Generate.start = function () {
  this.index = 0;
  this.maxIndex = 0;
  //TODO: take all the sections current in main schedule, push to lockedSections if not exists and set section.locked to true
  currentDays = View.Schedule.currentDays();
  //Iterating week days
  for (var i = 0; i < 5; i++) {
    //Iterating timegrouped blocks
    for (var j = currentDays[i].length; j--;) {
      //Iterating blocks in specific timeblock
      for (var k = currentDays[i][j].blocks.length; k--;) {
        section = currentDays[i][j].blocks[k].section;
        this.lockedSections.pushUnique(section, (s1, s2) => {
          return !(s1.uniq == s2.uniq);
        })
        section.locked = true;
      }
    }
  }


  this.visible = true
  console.log(this.schedules.length); 
  
  this.loading = true
  Mu.Controller.schedule_2()
  this.draw(this.index);    
  
  this.loading = false
}

Generate.restart = function() {
  this.index = 0;
  this.start();
}


/** Simply stops the entire generator. Also does other stuff. */
Generate.halt = function () {
  this.visible = false
}


Generate.displayNext = function() {
  console.log("displaynext in Generate")
  this.index = (this.index + 1) % this.maxIndex;
  this.draw(this.index);
}

Generate.displayPrevious = function() {
  console.log("displayPrevious in Generate")
  index = (this.index - 1) % this.maxIndex;
  if (index == -1) index = this.maxIndex - 1;
  this.index = index;
  this.draw(this.index);
}

Generate.select = function() {
  console.log("Generate select clicked");
  View.Schedule.displayGenerated(this.days);
  this.halt();
}


View.Generate = Generate;
//View.Generate.listenToBreaks();
//View.Generate.listenToLocks();
