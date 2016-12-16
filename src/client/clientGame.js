var GameController = require('./gameController.js');
var GameBox = require('./gameBox.js');
var Ball = require('./ball.js');
var Player = require('./player.js');
var Paddle = require('./paddle.js');
var keydown = require('./../../lib/key_status.js');
var animate = require('./animationFrame.js');
var eventListeners = require('./eventListeners.js');
var Pong = require('./clientGame.js');
require('./../../lib/jquery.hotkeys.js');
var View = require('./view.js');
var SocketEmitter = require('./eventEmitters.js');

var view = new View();

var Pong = function(socket){
  this.socket = socket
  this.localPlayer;
  this.opponent;
  this.localBall;
  this.gameController;
  this.gameEnded = false;
  this.lastPaddleMove = 0;
  this.audio = new Audio("sounds/march.mp3");
  this.outSound = new Audio("sounds/OutPong.wav");
  this.wallSound = new Audio("sounds/plop.ogg");
  this.paddleSound = new Audio("sounds/plop.ogg");
  this.gameOverSound = new Audio("sounds/game-over.wav");
  this.view = view
  var self = this
  this.view.signInForm.onsubmit = function(event, socket){
    event.preventDefault();
    self.view.afterSignInFormView();
    self.socket.emit('player sign in', {playerName: self.view.newPlayerName.value});
  }
  this.view.playAgain.onclick = function() {
    self.socket.emit("play again");
    self.view.afterPlayAgain();
  }
}

Pong.prototype.init = function(){// var view = new View();
  this.context = this.view.canvas.getContext('2d');
  this.context.font = '40px';
  this.gameBox = new GameBox(this.context);
  this.audio.play();
};

Pong.prototype.createPlayers = function(gameData){
  for(var i = 0; i < gameData.players.length; i++) {
    this.player = gameData.players[i];
    this.paddle = new Paddle(this.player.x, this.player.y, this.context);
    if (this.player.id === this.myId()) {
      this.localPlayer = new Player(this.paddle, this.context, this.player.name);
      this.localPlayer.id = this.myId();
    } else {
      this.opponent = new Player(this.paddle, this.context, this.player.name);
      this.opponent.id = this.player.id;
      this.view.startGameView();
      this.localBall = new Ball(this.context);
      this.localBall.setCoordinates(gameData.ballCoordinates);
      this.gameController = new GameController(this.localBall, this.gameBox, this.localPlayer, this.opponent);
      this.gameController.resetGame();
      this.countdown();
      this.draw();
    }
  }
}

Pong.prototype.createGame = function(gameData){
  this.view.startGameView();
  this.localBall = new Ball(this.context);
  this.localBall.setCoordinates(gameData.ballCoordinates);
  this.gameController = new GameController(this.localBall, this.gameBox, this.localPlayer, this.opponent);
  this.gameController.resetGame();
  this.countdown();
  this.draw();
}

Pong.prototype.setBallCoordinates = function(data) {
  this.localBall.setCoordinates(data);
}

Pong.prototype.onServerMovesBall = function(data) {
  this.localBall.setCoordinates(data);
}

Pong.prototype.onServerMovePlayer = function(data) {
  if (data.id === opponent.id) {
    this.opponent.paddle.setY(data.y);
  }
}

Pong.prototype.onServerUpdatesScores = function(data) {
  this.gameController.setScores(data);
}

Pong.prototype.declareWinner = function(data){
  if(this.gameController) {
    this.gameController.endGame();
    this.view.declareWinnerView(data.winner.name);
    this.gameOverSound.play()
  }
}

Pong.prototype.removePlayer = function(){
  if(this.gameController) {
    this.gameController.endGame();
    this.view.removePlayerView();
    this.gameOverSound.play()
  }
}

 Pong.prototype.onPaddleSmack = function(){
  this.paddleSound.play();
}

Pong.prototype.onWallSmack = function(){
  this.wallSound.play();
}

Pong.prototype.onOutOfBounds = function(){
  this.outSound.play();
}

Pong.prototype.myId = function() {
  return this.socket.io.engine.id;
}

Pong.prototype.countdown = function() {
  this.view.setGameStatusToCountdown();
  setTimeout(function() {
    this.audio.pause();
    this.view.setGameStatusToPlay();
    this.animate(gameLoop);
    return;
  }, 6000);
}

Pong.prototype.gameLoop = function(){
  this.checkForPaddleMove();
  this.draw();
  if (gameController.isGameEnded === false) {
    this.animate(gameLoop);
  }
}

Pong.prototype.draw = function(){
  this.gameController.drawGame();
}

Pong.prototype.checkForPaddleMove = function(){
  this.timeNow = new Date();
  this.timeSinceLastMove = timeNow - lastPaddleMove;
  if (this.timeSinceLastMove < 15) {
    return;
  }
  this.paddleMoved = false;
  if (keydown.down) {
    localPlayer.paddle.moveDown();
    this.paddleMoved = true;
  } else if (keydown.up) {
    this.localPlayer.paddle.moveUp();
    this.paddleMoved = true;
  }
  if (this.paddleMoved) {
    this.socket.emit("client moves player", {y: localPlayer.paddle.getY()});
    this.lastPaddleMove = timeNow;
  }
}


module.exports = Pong
