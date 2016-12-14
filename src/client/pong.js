var View = require('./view.js');

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
var gameBox;
var gameController;
var gameEnded = false;
var lastPaddleMove = 0;
var audio = new Audio("pongSound.mp3");
var pong = document.getElementById('pong');
var signInForm = document.getElementById('signIn');
var newPlayerName = document.getElementById('playerName');
var waiting = document.getElementById('waiting');
var disconnect = document.getElementById('disconnect');
var winner = document.getElementById('winner');
var playAgain = document.getElementById('playAgain');
var view;

(function init(){
  view = new View();
  context = view.canvas.getContext('2d');
  gameBox = new GameBox(context);
  socket = io.connect(getUrl());
  audio.play();
  setEventHandlers();
})();

function setEventHandlers() {
  socket.on("connect", onSocketConnected);
  socket.on("start game", startGame);
  socket.on("server moves ball", onServerMovesBall);
  socket.on("server moves player", onServerMovePlayer);
  socket.on("server updates scores", onServerUpdatesScores);
  socket.on("game won", declareWinner);
  socket.on("disconnect", onSocketDisconnect);
  socket.on("remove player", removePlayer);
}

function onSocketConnected() {
  console.log("Connected to socket server");
}

function startGame(gameData){
  view.startGameView();
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
  countdown();
  draw();
}


function onServerMovesBall(data) {
  localBall.setCoordinates(data);
}

function onServerMovePlayer(data) {
  if (data.id === opponent.id) {
    opponent.paddle.setY(data.y);
  }
}

function onServerUpdatesScores(data) {
  gameController.setScores(data);
}

function declareWinner(data){
  gameController.endGame();
  view.declareWinnerView(data.winner.name);
}

function onSocketDisconnect() {
  console.log("Disconnected from socket server");
}

function removePlayer(){
  gameController.endGame();
  disconnect.style.display = "inline";
  winner.style.display = 'none';
  gameStart = document.getElementById('countdown');
  gameStart.innerHTML = "Game Over!"
}

function myId() {
  return socket.io.engine.id;
}

function countdown() {
  var gameStart = document.getElementById('countdown');
  setTimeout(function() {gameStart.innerHTML="4"}, 1000);
  setTimeout(function() {gameStart.innerHTML="3"}, 2000);
  setTimeout(function() {gameStart.innerHTML="2"}, 3000);
  setTimeout(function() {gameStart.innerHTML="1"}, 4000);
  setTimeout(function() {
    audio.pause();
    gameStart = document.getElementById('countdown');
    gameStart.innerHTML = "Play!";
    animate(gameLoop);
    return;
  }, 5000);
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

function getUrl() {
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}
