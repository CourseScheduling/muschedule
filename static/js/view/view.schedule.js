const BLOCK_HEIGHT = 20;

var Schedule = new Vue({
  el: '#calendar__left',
  data: {
    schedules: Mu.Model.timeMap,
    days: [
      [],
      [],
      [],
      [],
      []
    ]
  },
  methods: {
    section: {
      add: null,
      remove: null,
      lock: null
    },
    style: null
  }
})


/**
 * Adds a section to the schedule plate
 * @param  {Section} section - The course section object
 */
Schedule.section.add = function (section) {
  var schedule = Mu.Model.timeMap[section.schedule]
  // Add a style to this section, based on schedule.
  section.style = this.style(schedule)

  // Go through all the days.
  for (var i = 0; i < 5; i++) {
    if (!schedule[i])
      return

    // Go through the groups in the day.
    for (var g = this.days[i].length; g--;) {
      var group = this.days[i][g]

      // If there's an intersect add it to the current group.
      if (group.time&schedule[i]) {
        group.sections.push(section)
        group.sections.set[section.uniq] = true
        return
      }
    }

    // Worst case, insert it as an extra.
    var set = {}
    set[section.uniq] = true

    this.days[i].push({
      set: set,
      time: schedule,
      sections: [section]
    })
  }
}

/**
 * Removes a section from the section plate.
 * @param  {Section} section - The course section object.
 */
Schedule.section.remove = function (section) {
  var schedule = Mu.Model.timeMap[section.schedule]

  // Go through all the days.
  for(var i = 0; i < 5; i++) {
    if (!schedule[i])
      return

    // Go through all the days.
    for (var g = this.days[i].length; g--;) {
      var group = this.days[i][g]

      if (!group.set[section.uniq])
        return

      // Update the group.
      delete group.set[section.uniq]
      group.sections = group.sections.filter(s => (s.uniq == section.uniq))
      group.time = group.sections.reduce((acc, val) => (acc|val), 0)
    }
  }
}


/**
 * Creates a simple style object for the schedule.
 * @param  {Array} schedule - the M-F array schedule
 * @return {Object}         - contains 2 main attributes, height and top.
 */
Schedule.style = function (schedule) {
  return schedule.reduce((acc, day) => {
    if (!day) {
      return acc
    }
    var start = arr[i].toString(2).indexOf('1')
    var end = arr[i].toString(2).lastIndexOf('1')

    acc.top = (BLOCK_HEIGHT * start) + 'px'
    acc.height = (end - start) + 'px'
  }, {})
}