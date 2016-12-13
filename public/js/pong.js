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
var gameEnded = false;
var gameStart;
var audio = new Audio("pongSound.mp3");

var pong = document.getElementById('pong');
var signInForm = document.getElementById('signIn');
var newPlayerName = document.getElementById('playerName');
var waiting = document.getElementById('waiting');
var disconnect = document.getElementById('disconnect');
var winner = document.getElementById('winner');
var playAgain = document.getElementById('playAgain');
var seconds = document.getElementById('countdown').innerHTML;

signInForm.onsubmit = function(event){
  event.preventDefault();
  waiting.style.display = 'inline';
  signInForm.style.display = 'none';
  socket.emit('player sign in', {playerName: newPlayerName.value});
}

playAgain.onclick = function() {
  socket.emit("play again");
  disconnect.style.display = 'none';
  waiting.style.display = 'inline';
  winner.style.display = 'none';
  playAgain.style.display = 'none';
  canvas.style.display = 'none';
}


function onSocketConnected() {
  ("Connected to socket server");
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

function onServerUpdatesScores(data) {
  gameController.setScores(data);
}

function setEventHandlers() {
	// Socket connection successful
	socket.on("connect", onSocketConnected);
	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);
	// Player move message received
	socket.on("server moves player", onServerMovePlayer);
  socket.on("server moves ball", onServerMovesBall);
  socket.on("server updates scores", onServerUpdatesScores);
  socket.on("start game", startGame);
  socket.on("remove player", removePlayer)
  socket.on("game won", declareWinner)
  socket.on("pong sound", pongSound)
};

function removePlayer(){
  gameController.endGame();
  disconnect.style.display = "inline";
  winner.style.display = 'none';
}

function declareWinner(data){
  gameController.endGame();
  var textHolder = document.createElement("h2")
  textHolder.innerHTML = data.winner.name + " wins!";
  winner.appendChild(textHolder)
  winner.style.display = 'inline';
  playAgain.style.display = 'inline';
}

function myId() {
  return socket.io.engine.id;
}

function countdown(){
  seconds = parseInt(seconds, 10);
  if (seconds == 1) {
    audio.pause();
    gameStart = document.getElementById('countdown');
    gameStart.innerHTML = "Play!";
    animate(gameLoop);
    return;
    }
  seconds--;
  gameStart = document.getElementById('countdown');
  gameStart.innerHTML = seconds;
  timeout = setTimeout(countdown, 500);
}

function startGame(gameData){
  pong.style.display = 'none'
  countdown();
  console.log("Starting game:");
  canvas.style.display = 'block';
  waiting.style.display = 'none';
  disconnect.style.display = 'none';
  winner.innerHTML = "";
  winner.style.display = 'none';
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
  gameController.resetGame();
  draw();
}

function gameLoop(){
  checkForPaddleMove();
  draw();
  if (gameController.isGameEnded === false) {
    animate(gameLoop);
  }
}

function draw(){
  gameController.drawGame();
}

var lastPaddleMove = 0;
function checkForPaddleMove(){
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
}

function getUrl() {
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}

(function init(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  gameBox = new GameBox(context);
  socket = io.connect(getUrl());
  audio.play();
  setEventHandlers();
})();
