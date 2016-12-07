var GameController = require('./gameController.js');
var GameBox = require('./gameBox.js');
var Ball = require('./ball.js');
var Player = require('./player.js');
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
  paddle1 = new Paddle(570, 150);
  paddle2 = new Paddle(15, 150);
  player1 = new Player(paddle1);
  player2 = new Player(paddle2);
  gameController = new GameController(ball, game, player1, player2);
  animate(play);
})();

function play(){
  draw();
  update();
  animate(play);
}

var draw = function(){
  gameController.drawGame();
};

var update = function(){
  gameController.update();
  gameController.movePaddle();
};
