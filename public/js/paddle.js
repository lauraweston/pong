function Paddle(context, x, y) {
  this.context = context;
  this.color = "white";
  this.width = 15;
  this.height = 70;
  this.x = x;
  this.y = y;
  this.ySpeed = 5;
}

Paddle.prototype.draw = function() {
  this.context.fillStyle = this.color;
  this.context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.moveDown = function() {
   if (this.y < 330) {this.y += this.ySpeed}
};

Paddle.prototype.moveUp = function(value) {
  if (this.y > 0) {this.y -= this.ySpeed}
};
module.exports = Paddle;
