function Paddle(x, y) {
  this.color = "white";
  this.width = 15;
  this.height = 70;
  this.x = x;
  this.y = y;
  this.ySpeed = 5;
}

Paddle.prototype.draw = function() {
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.moveDown = function() {
   if (this.y < 330) {this.y += this.ySpeed}
};

Paddle.prototype.moveUp = function(value) {
  if (this.y > 0) {this.y -= this.ySpeed}
};

Paddle.prototype.setY = function(y) {
  this.y = y;
}

Paddle.prototype.setX = function(x) {
  this.x = x;
}

Paddle.prototype.getY = function() {
  return this.y;
}

Paddle.prototype.getX = function() {
  return this.x;
}

module.exports = Paddle;
