var socket;
var localPlayer;
var opponent;
var localBall;
var context;
var canvas;
var gameBox;
var gameController;
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
  context = canvas.getContext('2d');
  gameBox = new GameBox(context);
  console.log(gameBox);
  // localBall = new Ball(context);
  socket = io.connect('http://localhost:3000');
  setEventHandlers();
};

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
};

function onMovePlayer(data) {
  if(data.id === opponent.id) {
    opponent.paddle.setY(data.y);
  }
}

function onServerMovesBall(data) {
  localBall.setCoordinates(data);
  console.log(data);
}

function setEventHandlers() {
	// Socket connection successful
	socket.on("connect", onSocketConnected);
	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);
	// Player move message received
	socket.on("server moves player", onMovePlayer);
  socket.on("draw game", onServerMovesBall);
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
      localPlayer = new Player(paddle, context, player.name);
      localPlayer.id = myId();
    } else {
      opponent = new Player(paddle, context, player.name);
      opponent.id = player.id;
    }
  }
  createBall(context, gameData.ballCoordinates, createGameController);
    console.log(gameBox);
    console.log(localBall);
    console.log(localPlayer);
  // // localBall.setCoordinates(gameData.ballCoordinates);
  // console.log(1);
  // console.log(gameData.ballCoordinates);
  // console.log(localBall);
  // gameController = new GameController(localBall, gameBox, localPlayer, opponent);
  // console.log(2);

}

function createBall(context, ballCoordinates, callback) {
  localBall = new Ball(context, ballCoordinates);
  callback(localBall, gameBox, localPlayer, opponent);
}

function createGameController(a, b, c, d) {
  gameController = new GameController(a, b, c, d);
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
  socket.emit("update game controller");
  if (keydown.down) {
    localPlayer.paddle.moveDown();
    socket.emit("client moves player", {y: localPlayer.paddle.getY()});
  }
  if (keydown.up) {
    localPlayer.paddle.moveUp();
    socket.emit("client moves player", {y: localPlayer.paddle.getY()});
  }
};

init();
