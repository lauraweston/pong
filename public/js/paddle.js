// var canvas = document.getElementById('canvas');
// var context = canvas.getContext('2d');

function Paddle(context, x, y) {
  this.context = context;
  this.color = "red";
  this.width = 30;
  this.height = 100;
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

// var paddle1 = new Paddle(context, 550, 150);
//
// function draw(paddle) {
//   context.clearRect(0, 0, 600, 400);
//   paddle.draw();
// }
//
// var FPS = 30;
// setInterval(function() {
//   update(paddle1);
//   draw(paddle1);
// }, 1000/FPS);

function update(paddle) {
  if (keydown.up) {
    paddle.update(-5);
  }
  if (keydown.down) {
    paddle.update(5);
  }
}

module.exports = Paddle;
