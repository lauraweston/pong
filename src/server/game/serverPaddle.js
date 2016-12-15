function ServerPaddle(x, y) {
  this.color = "white";
  this.width = 15;
  this.height = 70;
  this.x = x;
  this.y = y;
  this.startingY = y;
  this.ySpeed = 5;
};

ServerPaddle.prototype.setY = function(y) {
  this.y = y;
};

ServerPaddle.prototype.getY = function() {
  return this.y;
};

ServerPaddle.prototype.getX = function() {
  return this.x;
};

ServerPaddle.prototype.reset = function() {
  this.y = this.startingY;
};

module.exports = ServerPaddle;
