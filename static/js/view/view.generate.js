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
    maxIndex: 0
  },
  
  methods: {
    start: null,
    halt:  null,
    displayPrevious: null,
    displayNext: null,
    select: null
  }
})



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
        start = start * Mu.View.blockHeight + 25;
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

}

View.Generate = Generate