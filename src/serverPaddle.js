function Paddle(x, y) {
  this.color = "white";
  this.width = 15;
  this.height = 70;
  this.x = x;
  this.y = y;
  this.startingY = y;
  this.ySpeed = 5;
};

Paddle.prototype.setY = function(y) {
  this.y = y;
};

Paddle.prototype.getY = function() {
  return this.y;
};

Paddle.prototype.getX = function() {
  return this.x;
};

Paddle.prototype.reset = function() {
  this.y = this.startingY;
};


module.exports = Paddle;
