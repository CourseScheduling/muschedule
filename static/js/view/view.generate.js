var breakTable = [];
for (var i = 0; i < 28; i++) {
  this.breakTable.push({"0":false, "1":false, "2":false, "3":false, "4":false});
}
var mousedown = false; 
var addBreaks = false;

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
    lockedSections: []
  },    
  methods: {
    start: null,
    halt:  null,
    displayPrevious: null,
    displayNext: null,
    select: null,
    lockSection: null
  },
  watch: {
    breakTable: {
      handler: function(after, before) {
      },
      deep: true
    }
  }
})

// Function to bubble event even when elements aren't nested in dom
Generate.triggerLowerElement = function(event) {
  var mouseX = event.pageX;
  var mouseY = event.pageY;
  var underlyingCell = document.elementsFromPoint(mouseX, mouseY);
  for (var i = 0; i < underlyingCell.length; i++) {
    if (underlyingCell[i].classList.contains("cal__block--data")) {
      console.log("Dispatchign event");
      console.log(underlyingCell[i]);
      delegateEvent = new MouseEvent('mousedown', {button: event.which, target: underlyingCell[i]});
      underlyingCell[i].dispatchEvent(delegateEvent);
    }
  }
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

Generate.listenToBreaks = function() {  
  var self = this;
  var rescheduleTimeout;

  function handleTrigger(target) {
    console.log("Handling break trigger");
    attributes = target.attributes;
    dataTime = attributes["data-time"].value;
    dataDay = attributes["data-day"].value;   

    self.breakTable[dataTime][dataDay] = addBreaks;    
    mask = 1 << dataTime;
    self.breaks[dataDay] ^= mask;
  }

  calBlockElements = document.getElementsByClassName("cal__block--data");
  for (var i = calBlockElements.length; i--;) {
    calBlockElements[i].addEventListener('mousedown', function(event) {
      console.log("CAPTURE")
      console.log(event);
      if (event.button !== 1 && event.which !== 1) return;
      console.log("0")
      clearTimeout(rescheduleTimeout);
      console.log("1");
      attributes = event.target.attributes;
      dataTime = attributes["data-time"].value;
      dataDay = attributes["data-day"].value;
      breakTableData = self.breakTable[dataTime][dataDay];
      breakTableData ? addBreaks = false : addBreaks = true;
      console.log("2");
      handleTrigger(event.target);
      mousedown = true;
    }, true);
  }


  document.onmouseup = function() {
    if (mousedown == true) rescheduleTimeout = setTimeout(self.restart.bind(self), 1000);
    mousedown = false;    
  }

  dataBlocks = document.getElementsByClassName('cal__block--data');
  for (var i = dataBlocks.length; i--; ) {
    dataBlocks[i].onmouseover = function(event) {
      if (mousedown) {
        handleTrigger(event.target);
      }
    }
  }
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
  if (index == -1) index = maxIndex - 1;
  this.index = index;
  this.draw(this.index);
}

Generate.select = function() {
  console.log("Generate select clicked");
  View.Schedule.displayGenerated(this.days);
  this.halt();
}


View.Generate = Generate;
View.Generate.listenToBreaks();
//View.Generate.listenToLocks();
