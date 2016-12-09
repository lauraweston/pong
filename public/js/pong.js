var socket;
var localPlayer;
var opponent;
var ball;
var context;
var canvas;
var gameBox;
var gameController;
var userName;
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

function init(){
  canvas = document.getElementById("canvas");
  userName = document.getElementById("playerName").value;
  console.log(userName);
  context = canvas.getContext('2d');
  gameBox = new GameBox(context);
  ball = new Ball(context);
  socket = io.connect('http://localhost:3000');
  setEventHandlers();
};

// function setUserName(){
//   socket.emit("add username", userName);
// }

function onSocketConnected() {
  console.log("Connected to socket server");
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onMovePlayer(data) {
  if(data.id === opponent.id) {
    opponent.paddle.setY(data.y);
  }
}

function setEventHandlers() {
	// Socket connection successful
	socket.on("connect", onSocketConnected);
	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);
	// Player move message received
	socket.on("move player", onMovePlayer);

  socket.on("start game", startGame);
};

function myId() {
  return socket.io.engine.id;
}

function startGame(gameData){
  console.log("Starting game:");
  for(var i = 0; i < gameData.players.length; i++) {
    var player = gameData.players[i];
    var paddle = new Paddle(player.x, player.y, context);
    if(player.id === myId()) {
      localPlayer = new Player(paddle, context);
      localPlayer.id = myId();
    } else {
      opponent = new Player(paddle, context);
      opponent.id = player.id;
    }
  }
  gameController = new GameController(ball, gameBox, localPlayer, opponent);

  animate(gameLoop);
}

function gameLoop(){
  update();
  draw();
  animate(gameLoop);
}

var draw = function(){
  gameController.drawGame();
};

var update = function(){
  gameController.update();
  if (keydown.down) {
    localPlayer.paddle.moveDown();
    socket.emit("move player", {y: localPlayer.paddle.getY()});
    }
  if (keydown.up) {
    localPlayer.paddle.moveUp();
    socket.emit("move player", {y: localPlayer.paddle.getY()});
    }
  };

init();
