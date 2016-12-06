var GameBox = require('./gameBox.js');
var Ball = require('./ball.js');
var Paddle = require('./paddle.js');
var keydown = require('./../../lib/key_status.js');
require('./../../lib/jquery.hotkeys.js');

var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function (callback) {window.setTimeout(callback, 10000 / 60)};

(function init(){
  var canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  game = new GameBox();
  ball = new Ball();
  paddle1 = new Paddle(context, 570, 150);
  paddle2 = new Paddle(context, 15, 150);
  animate(play);
})();

function play(){
  draw();
  update();
  animate(play);
}

var draw = function(){
  game.draw();
  ball.draw();
  paddle1.draw();
  paddle2.draw();
}

var update = function(){
  ball.update(paddle1, paddle2);
  updatePaddle1(paddle1);
  updatePaddle2(paddle2);

}

function updatePaddle1(paddle) {
  if (keydown.down) {
    paddle.moveDown();
  }
  if (keydown.up) {
    paddle.moveUp();
  }
}

function updatePaddle2(paddle) {
  if (keydown.ctrl) {
    paddle.moveDown();
  }
  if (keydown.shift) {
    paddle.moveUp();
  }
}
