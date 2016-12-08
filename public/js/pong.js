var socket;
var localPlayer;
var remotePlayers = [];
var ball;
var context;
var canvas;
var gameBox;
var gameController
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
  ball = new Ball(context);
  socket = io.connect('http://localhost:3000');
  var x;
  var y = 150;
  if (remotePlayers.length === 0) {
    x = 570;
  } else {
    x = 15;
  }
  var paddle = new Paddle(x, y);
  localPlayer = new Player(paddle, context);
  setEventHandlers();
  setUpGame();
};

function onSocketConnected() {
  console.log("Connected to socket server")
  socket.emit("new player", {x: localPlayer.paddle.getX(), y: localPlayer.paddle.getY()});
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
  console.log(data)
  console.log("New Player has connected: "+data.id);
  var newPaddle = new Paddle(data.x, data.y);
  var newPlayer = new Player(newPaddle, context);
  console.log(newPlayer)
  newPlayer.id = data.id;
  remotePlayers.push(newPlayer);
  console.log(remotePlayers)
}

function onMovePlayer(data) {
  var movePlayer = playerById(data.id)
  movePlayer.paddle.setY(data.y)
}

function onRemovePlayer(data){
  var removePlayer = playerById(data.id)
  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
}

function setEventHandlers() {
	// Socket connection successful
	socket.on("connect", onSocketConnected);
	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);
	// New player message received
	socket.on("new player", onNewPlayer);
	// Player move message received
	socket.on("move player", onMovePlayer);
	// Player removed message received
	socket.on("remove player", onRemovePlayer);
};

function setUpGame(){
  gameBox.draw();
  ball.draw();
  animate(gameStart);

  if (remotePlayers.length >= 1) {
  var newPlayer = remotePlayers[0]
}
}

function gameStart(){
  draw();
  update();
  animate(gameStart);
}

var draw = function(){
  gameController.drawGame();
};

var update = function(){
  gameController.update();
  if (keydown.down) {
    localPlayer.paddle.moveDown();
    socket.emit("move player", {y: localPlayer.paddle.getY()})
    }
  if (keydown.up) {
    localPlayer.paddle.moveUp();
    socket.emit("move player", {y: localPlayer.paddle.getY()})
    }
  };

function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};

	return false;
};

init();
