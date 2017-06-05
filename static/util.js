var COLORS = [
  "#26A65B",
  "#1E824C",
  "#4DAF7C",
  "#00B16A",
  "#D24D57",
  "#D64541",
  "#96281B",
  "#663399",
  "#674172",
  "#8E44AD",
  "#913D88",
  "#4183D7",
  "#446CB3",
  "#3A539B",
  "#1E8BC3",
  "#1F3A93"
]
var ColourGen = {
  colorMap: {},
  usedMap: {},
  add: function (course) {
    var i = 0
    while(ColourGen.usedMap[COLORS[(i = ~~(Math.random() * COLORS.length))]]){}

    ColourGen.colorMap[course] = COLORS[i]
    ColourGen.usedMap[i] = course
    return COLORS[i]
  },
  remove: function (course) {
    var color = ColourGen.colorMap[course]
    delete ColourGen.usedMap[color]
    delete ColourGen.colorMap[course]
  },
  get: function (section) {
    var a = section.split(' ')
    a.pop()
    console.log(a.join(' '))
    return ColourGen.colorMap[a.join(' ')]
  }
}



var UTILS = {
  getStart: function (scheduleInt) {
    for (var i = 0; i < 32; i++) {
      if ((scheduleInt >> i) & 1) {
        return i;
      }
    }
  },
  getHeight: function (scheduleInt, start) {
    for (var i = start; i < 32; i++) {
      if (!((scheduleInt >> i) & 1)) {
        return i - start;
      }
    }
  }
}


Array.prototype.pushUnique = function(object, compareMethod) {
  var found = false;
  for (var i = this.length; i--;) {
    if (compareMethod(this[i], object) == 0) {
      found = true;
    }
  }
  if (!found) this.push(object);
}







