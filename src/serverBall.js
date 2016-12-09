var ServerBall = function(){
  this.x = 300;
  this.y = 20;
  this.xSpeed = 3;
  this.ySpeed = 2;
};

Ball.prototype.bouncePaddle = function(){
  this.xSpeed = -this.xSpeed;
};

Ball.prototype.bounceWall = function(){
  this.ySpeed = -this.ySpeed;
};

Ball.prototype.update = function(){
  this.x += this.xSpeed;
  this.y += this.ySpeed;
};

Ball.prototype.getCoordinates = function () {
  return {
    x: this.x,
    y: this.y
  };
};

Ball.prototype.reset = function(){
  this.x = 300;
  this.y = 20;
  this.xSpeed = 3;
  this.ySpeed = 2;
};
module.exports = ServerBall;
