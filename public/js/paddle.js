var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

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

var paddle1 = new Paddle(context, 965, 0);
// var paddle2 = new Paddle(contex, 0, 0);

function draw(paddle) {
  paddle.draw();
}

var FPS = 30;
setInterval(function() {
  // update();
  draw(paddle1);
}, 1000/FPS);

// function update() {
//   if ()
//
// }
