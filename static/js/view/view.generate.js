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
    days: [
      [],
      [],
      [],
      [],
      []
    ],
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
    select: null
  },
  watch: {
    breakTable: {
      handler: function(after, before) {
      },
      deep: true
    }
  }
})


//Returns the starting index, 0 being 8, in 30 minute blocks
function getStart(scheduleInt) {

}

//Returns the size of the blocks (number of 30 minute blocks)
function getHeight(scheduleInt, startPos) {

}




Generate.listenToLocks = function() {
  var self = this;
  var lockedSections = this.lockedSections;
  sectionBlockElements = document.getElementsByClassName('block__dayGroup');
  console.log(sectionBlockElements.length);
  for (var i = sectionBlockElements.length; i--;) {
    console.log("binding onmousedown to section block");
    document.oncontextmenu = function(event) {
      if (event.target.className.includes("block__dayGroup")) {
        console.log("Locking section");
        sch = event.target.getAttribute("data-sch");
        sec = event.target.getAttribute("data-sec"); 
        isLocked = event.target.className.includes("section__block--locked");
        
        if (isLocked) {
          for (var i = lockedSections.length; i--;) {
            if (lockedSections[i][0] == sch && lockedSections[i][1] == sec) {
              lockedSections.splice(i, 1);
              break;
            }
          }
        } else {
          lockedSections.push([sch, sec]);
        }     
        self.restart();
        return false;
        //Toggle data to toggle class 
      } else {
        return true;
      }
    }

    sectionBlockElements[i].onmouseover = function(event) {

    }
  }
}

Generate.listenToBreaks = function() {  
  var self = this;
  var rescheduleTimeout;

  function handleTrigger(target) {
    attributes = target.attributes;
    dataTime = attributes["data-time"].value;
    dataDay = attributes["data-day"].value;   

    self.breakTable[dataTime][dataDay] = addBreaks;    
    mask = 1 << dataTime;
    self.breaks[dataDay] ^= mask;
  }

  calBlockElements = document.getElementsByClassName("cal__block--data");
  for (var i = calBlockElements.length; i--;) {
    calBlockElements[i].onmousedown = function(event) {
      if (event.which !== 1) return;
      clearTimeout(rescheduleTimeout);
      attributes = event.target.attributes;
      dataTime = attributes["data-time"].value;
      dataDay = attributes["data-day"].value;
      breakTableData = self.breakTable[dataTime][dataDay]; 
      breakTableData ? addBreaks = false : addBreaks = true;
      handleTrigger(event.target);
      mousedown = true;
    }
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


/** Adds sections to data.days */
Generate._updateDays = function(scheduleToRender, schedules, sections) {
  for (var i = 0; i < scheduleToRender.length; i++) {
    groupingNumber = scheduleToRender[i][0];
    sectionNumber = scheduleToRender[i][1];
    sectionSchedule = schedules[groupingNumber][sectionNumber];
    section = sections[groupingNumber][sectionNumber];

    for (var ii = sectionSchedule.length; ii--;) {
      if (sectionSchedule[ii]) {
        courseCode = section.uniq.split(" ").slice(0, 2).join(" ");

        start = UTILS.getStart(sectionSchedule[ii]);
        height = UTILS.getHeight(sectionSchedule[ii], start) * Mu.View.BLOCK_HEIGHT;
        start = start * Mu.View.BLOCK_HEIGHT;
        this.days[ii].push({
          sectionCode: section.uniq,
          courseCode: courseCode,
          styleObject: {
            top: start + 'px',
            height: height + 'px'
          },
          sch: groupingNumber,
          sec: sectionNumber
        });
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
  var schedules = Mu.Model.getSchedules();
  var sections = Mu.Model.getSections();
  this._updateDays(scheduleToRender, schedules, sections);
  this.maxIndex = Mu.Controller.validSchedules.length;
}

/** Simply turns the generator screen on. Also checks for scheduling. */
Generate.start = function () {
  this.visible = true

  if (!this.schedules.length) {
    this.loading = true
    this.loading = false; //TODO: remove later
    Mu.Controller.schedule_2()
    this.draw(this.index);    
  }
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
  this.draw(index);
}

Generate.displayPrevious = function() {
  console.log("displayPrevious in Generate")
  index = (this.index - 1) % this.maxIndex;
  if (index == -1) index = maxIndex - 1;
  this.index = index;
  this.draw(index);
}

Generate.select = function() {
  console.log("Generate select clicked");
  View.Schedule.displayGenerated(this.days);
  this.halt();
}



View.Generate = Generate;
View.Generate.listenToBreaks();
View.Generate.listenToLocks();


