var Ball = function(context, ballCoordinates){
  console.log('hello from ball.js');
  //console.log(ballCoordinates); - this logs
  //console.log(ballCoordinates.x); - this also logs
  this.x = ballCoordinates.x;
  console.log(this.x);
  this.y = ballCoordinates.y;
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
  console.log('hello from ball.js');
  console.log(ballCoordinates);
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
