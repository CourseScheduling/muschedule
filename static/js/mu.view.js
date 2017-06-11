var View = {}

View.BLOCK_HEIGHT = 20;



View.style = function(time, color) {
  var top = UTILS.getStart(time);
  var height = UTILS.getHeight(time, top);
  height  *= this.BLOCK_HEIGHT;
  top *= this.BLOCK_HEIGHT;
  return {
    top: top+"px",
    height: height+"px",
    backgroundColor: color
  }
}


Mu.View = View