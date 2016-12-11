var GameController = require('./gameController.js');
var GameBox = require('./gameBox.js');
var Ball = require('./ball.js');
var Player = require('./player.js');
var Paddle = require('./paddle.js');
var keydown = require('./../../lib/key_status.js');
var animate = require('./animationFrame.js');
require('./../../lib/jquery.hotkeys.js');

var socket;
var localPlayer;
var opponent;
var localBall;
var context;
var canvas;
var gameBox;
var gameController;

var signDiv = document.getElementById('signDiv');
var play = document.getElementById('signIn');
var newUsername = document.getElementById('username');

play.onclick = function(){
  signDiv.style.display = 'none';
  socket.emit('user sign in',{username: newUsername.value});
}

function onSocketConnected() {
  console.log("Connected to socket server");
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}

function onServerMovePlayer(data) {
  if (data.id === opponent.id) {
    opponent.paddle.setY(data.y);
  }
}

function onServerMovesBall(data) {
  localBall.setCoordinates(data);
}

function setEventHandlers() {
	// Socket connection successful
	socket.on("connect", onSocketConnected);
	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);
	// Player move message received
	socket.on("server moves player", onServerMovePlayer);
  socket.on("server moves ball", onServerMovesBall);
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
    if (player.id === myId()) {
      localPlayer = new Player(paddle, context, player.name);
      localPlayer.id = myId();
    } else {
      opponent = new Player(paddle, context, player.name);
      opponent.id = player.id;
    }
  }
  localBall = new Ball(context);
  localBall.setCoordinates(gameData.ballCoordinates);
  gameController = new GameController(localBall, gameBox, localPlayer, opponent);

  animate(gameLoop);
}

function gameLoop(){
  checkForPaddleMove();
  draw();
  animate(gameLoop);
}

var draw = function(){
  gameController.drawGame();
};

var lastPaddleMove = 0;
var checkForPaddleMove = function(){
  var timeNow = new Date();
  var timeSinceLastMove = timeNow - lastPaddleMove;

  if (timeSinceLastMove < 15) {
    return;
  }

  var paddleMoved = false;
  if (keydown.down) {
    localPlayer.paddle.moveDown();
    paddleMoved = true;
  } else if (keydown.up) {
    localPlayer.paddle.moveUp();
    paddleMoved = true;
  }

  if (paddleMoved) {
    socket.emit("client moves player", {y: localPlayer.paddle.getY()});
    lastPaddleMove = timeNow;
  }
};

(function init(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  gameBox = new GameBox(context);
  socket = io.connect('http://localhost:3000');
  setEventHandlers();
})();
