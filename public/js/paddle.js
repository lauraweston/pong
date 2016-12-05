

function Paddle(context, x, y) {
  this.context = context;
  this.color = "red";
  this.width = 15;
  this.height = 70;
  this.x = x;
  this.y = y;
}

Paddle.prototype.draw = function() {
  this.context.fillStyle = this.color;
  this.context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.update = function(value) {
  this.y += value;
};


module.exports = Paddle;
