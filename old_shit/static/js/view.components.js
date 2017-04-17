


function listen (listeners) {
  for(var event in listeners) {
    this.addEventListener(event, listeners[event])
  }
}

// This is for the range sliders.
// They have an id that can be accessed by the name attribute.

function sliderInit() {
  // Go through the range sliders
  var sliders = document.getElementsByClassName('range__wrap')
  for(var i = sliders.length; i--;) {
    // Call the listen with this slider.
    listen.call(sliders[i], sliderEvents)
  }
}



sliderEvents = {
  mousedown: function (e) {

  },
  mouseup: function (e) {

  },
  mousemove: function (e) {

  }
}


sliderInit()