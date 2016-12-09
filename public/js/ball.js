var Ball = function(context){
  // this.x = 300;
  // this.y = 20;
  // this.xSpeed = 3;
  // this.ySpeed = 2;
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
// Ball.prototype.bouncePaddle = function(){
//   this.xSpeed = -this.xSpeed;
// };
//
// Ball.prototype.bounceWall = function(){
//   this.ySpeed = -this.ySpeed;
// };
//
// Ball.prototype.update = function(){
//   this.x += this.xSpeed;
//   this.y += this.ySpeed;
// };
//
// Ball.prototype.reset = function(){
//   this.x = 300;
//   this.y = 20;
//   this.xSpeed = 3;
//   this.ySpeed = 2;
// };
module.exports = Ball;
