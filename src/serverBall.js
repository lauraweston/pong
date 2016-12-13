var ServerBall = function(){
  this.x = 300;
  this.y = 20;
  this.xSpeed = 3;
  this.ySpeed = 2;
};

ServerBall.prototype.bouncePaddle = function(speed){
  this.xSpeed += 0.2
  this.ySpeed = (Math.random() * 3) + (-3)
  this.xSpeed = (-this.xSpeed);
};

ServerBall.prototype.bounceWall = function(){
  this.ySpeed = -this.ySpeed;
};

ServerBall.prototype.update = function(){
  this.x += this.xSpeed;
  this.y += this.ySpeed;
};

ServerBall.prototype.getCoordinates = function () {
  return {
    x: this.x,
    y: this.y
  };
};

ServerBall.prototype.reset = function(){
  this.x = 300;
  this.y = 20;
  this.xSpeed = 3;
  this.ySpeed = 2;
};

module.exports = ServerBall;
