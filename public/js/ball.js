var Ball = function(context){
  this.context = context;
};

Ball.prototype.draw = function(){
  console.log('ball is being drawn');
  this.context.beginPath();
  this.context.arc(this.x, this.y, 7, 0, Math.PI*2, true)
  this.context.fillStyle = "white";
  this.context.closePath();
  this.context.fill();
  console.log('ball is still being drawn');
};

Ball.prototype.setCoordinates = function (ballCoordinates) {
  this.x = ballCoordinates.x;
  this.y = ballCoordinates.y;
};

module.exports = Ball;
