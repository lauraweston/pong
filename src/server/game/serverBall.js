var ServerBall = function(){
  this.x = 300;
  this.y = 20;
  this.xSpeed = 3;
  this.ySpeed = 2;
};

ServerBall.prototype.bouncePaddle = function(){
  this.xSpeed += 0.2
  this.xSpeed = (-this.xSpeed);
  this.paddleSound = true;
};

ServerBall.prototype.bounceWall = function(){
  this.ySpeed = -this.ySpeed;
  this.wallSound = true;
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
  this.outSound = true;
  this.x = 300;
  this.y = 20;
  this.xSpeed = 3;
  this.ySpeed = 2;
};

ServerBall.prototype.resetSounds = function() {
  this.paddleSound = false;
  this.wallSound = false;
  this.outSound = false;
}

module.exports = ServerBall;
