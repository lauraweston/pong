var Ball = function(context){
  this.context = context;
};

Ball.prototype.draw = function(){
  this.context.beginPath();
  this.context.arc(this.x, this.y, 7, 0, Math.PI*2, true)
  this.context.fillStyle = "white";
  this.context.closePath();
  this.context.fill();
};

Ball.prototype.setCoordinates = function (ballCoordinates) {
  this.x = ballCoordinates.x;
  this.y = ballCoordinates.y;
};

module.exports = Ball;
