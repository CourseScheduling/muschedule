var breakTable = [];
for (var i = 0; i < 28; i++) {
  this.breakTable.push({"0":false, "1":false, "2":false, "3":false, "4":false});
}

var Generate = new Vue({
  el: '#gen__wrap',
  data: {
    visible: false,
    loading: true,
    schedules: [],
    courseMap: {},
    maxNumber: "",
    days: [
      [],
      [],
      [],
      [],
      []
    ],
    tempDays: [
      [],
      [],
      [],
      [],
      []
    ],
    index: 0,
    maxIndex: 0,
    breakTable: breakTable,
    breaks: [0,0,0,0,0]
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
var mousedown = false; 
var addBreaks = false;

//Returns the starting index, 0 being 8, in 30 minute blocks
function getStart(scheduleInt) {
  for (var i = 0; i < 32; i++) {
    if ((scheduleInt >> i) & 1) {
      return i;
    }
  }
}

//Returns the size of the blocks (number of 30 minute blocks)
function getHeight(scheduleInt, startPos) {
  for (var i = startPos; i < 32; i++) {
    if (!((scheduleInt >> i) & 1)) {
      return i - startPos;
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

        start = getStart(sectionSchedule[ii]);
        height = getHeight(sectionSchedule[ii], start) * Mu.View.blockHeight;
        start = start * Mu.View.blockHeight;
        this.days[ii].push({
          sectionCode: section.uniq,
          courseCode: courseCode,
          styleObject: {
            top: start + 'px',
            height: height + 'px'
          }
        });
      }
    }

  }
};

Generate.listenToBreaks = function() {  
  var self = this;

  function handleTrigger(target) {
    attributes = target.attributes;
    dataTime = attributes["data-time"].value;
    dataDay = attributes["data-day"].value;
    

    self.breakTable[dataTime][dataDay] = addBreaks;
    console.log(self.breakTable);
    mask = 1 << dataTime;
    self.breaks[dataDay] ^= mask;
  }

  document.onmousedown = function(event) {
    if (event.target.className.includes("cal__block--data")) {
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
    Mu.Controller.schedule_2()
    this.draw(this.index);    
  }

  this.loading = false
}

/** Simply stops the entire generator. Also does other stuff. */
Generate.halt = function () {
  this.visible = false
}
Generate.displayNext = function() {
  console.log("displaynext in Generate")
  index = this.index;
  maxIndex = this.maxIndex;
  this.index = (index + 1) % maxIndex;
  this.draw(index);
}

Generate.displayPrevious = function() {
  console.log("displayPrevious in Generate")
  index = this.index;
  maxIndex = this.maxIndex;
  index = (index - 1) % maxIndex;
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