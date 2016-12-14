var util = require('util');
var Ball = require('./serverBall.js');
var Player = require("./serverPlayer.js");
var Paddle = require("./serverPaddle.js");

var ServerGameController = function(){
  this.ball = new Ball();
  this.paddle1 = new Paddle(15, 150);
  this.paddle2 = new Paddle(570, 150);
  this.gameBox = {
                  height: 400,
                  width:  600,
                  x:        0,
                  y:        0
  };
  this.gameLoopInterval = 8;
  this.isGameEnded = false;
};

ServerGameController.prototype.addNewPlayerToGame = function(newPlayerId) {
  if (this.player1 && this.player2) {
    console.log('Already 2 players in game so exiting');
    return;
  }
  if (!this.player1) {
    this.player1 = new Player(this.paddle1, newPlayerId);
  } else {
    this.player2 = new Player(this.paddle2, newPlayerId);
  }
};

ServerGameController.prototype.updatePlayerName = function(data, io, client){
  var playerToBeUpdated = this.playerById(client.id);
  playerToBeUpdated.setName(data.playerName);
  if (this.player1 && this.player2 && (this.player1.name.length > 0 ) && (this.player2.name.length > 0) && this.player1.isReady && this.player2.isReady) {
    console.log("Starting game");
    this.startGame(io);
  }
};

ServerGameController.prototype.startGame = function(io) {
  var playerData = [
    {
      id: this.player1.id,
      name: this.player1.name,
      x: this.player1.paddle.getX(),
      y: this.player1.paddle.getY()
    },
    {
      id: this.player2.id,
      name: this.player2.name,
      x: this.player2.paddle.getX(),
      y: this.player2.paddle.getY()
    }
  ];

  var startingGameData = {
    players: playerData,
    ballCoordinates: this.ball.getCoordinates()
  };
  //TODO: extract to SocketEventEmitter
  io.sockets.emit("start game", startingGameData);
  this.startGameLoop(io);
};

ServerGameController.prototype.startGameLoop = function(io) {
  this.resetPlayerReadyState();
  var self = this;
  var gameLoopTick = function() {
    if (!self.isGameEnded){
      self.update();
      self.gameLoopTickCallback(io);
      self.gameLoop = setTimeout(gameLoopTick, self.gameLoopInterval);
    } else {
      clearTimeout(self.gameLoop);
    }
  };
  gameLoopTick();
};//TODO: this is untested

//TODO: extract & needs access to io
ServerGameController.prototype.gameLoopTickCallback = function(io) {
  io.sockets.emit("server moves ball", this.ball.getCoordinates());
  io.sockets.emit("server updates scores", this.getPlayerScores());
  if (this.winner){
    io.sockets.emit("game won", {winner: this.winner});
  }
};

ServerGameController.prototype.endGameLoop = function() {
  this.isGameEnded = true;
};

ServerGameController.prototype.removePlayer = function(client){
  util.log("Player has disconnected: " + client.id);
  var disconnectedPlayer = this.playerById(client.id);
  if (disconnectedPlayer === this.player1) {
    this.player1 = undefined;
  } else {
    this.player2 = undefined;
  }
  //TODO: move to socketEventEmitter
  client.broadcast.emit("remove player");
  this.endGameLoop();
};

ServerGameController.prototype.playAgain = function(io, client) {
  var playerToReset = this.playerById(client.id);
  playerToReset.reset();
  if (this.player1 && this.player2 && this.player1.isReady && this.player2.isReady) {
    this.startGame(io);
  }
};

ServerGameController.prototype.resetPlayerReadyState = function() {
  this.player1.setPlayStatus(false);
  this.player2.setPlayStatus(false);
};

ServerGameController.prototype.movePlayer = function(data, client) {
  var movePlayer = this.playerById(client.id);
  movePlayer.paddle.setY(data.y);
  //TODO: move to socketEventEmitter
  client.broadcast.emit("server moves player", {id: movePlayer.id, x: movePlayer.paddle.getX(), y: movePlayer.paddle.getY()});
};

ServerGameController.prototype.update = function(){
  this.ball.update();
  this.ballHitsWall();
  this.ballHitsPaddle();
  this.ballGoesOutOfPlay();
  this.assignWinner();
};

ServerGameController.prototype.ballHitsWall = function(){
  if(this.ball.y <= this.gameBox.y || this.ball.y >= this.gameBox.height) {
    this.ball.bounceWall();
  }
};

ServerGameController.prototype.ballHitsPaddle = function(){
  if(this.ball.x >= this.player1.paddle.x && this.ball.x <= (this.player1.paddle.x + this.player1.paddle.width) && (this.ball.y >= this.player1.paddle.y && this.ball.y <= (this.player1.paddle.y + this.player1.paddle.height))) {
    this.ball.bouncePaddle();
  }
  if(this.ball.x >= this.player2.paddle.x && this.ball.x <= (this.player2.paddle.x + this.player2.paddle.width) && (this.ball.y >= this.player2.paddle.y && this.ball.y <= (this.player2.paddle.y + this.player2.paddle.height))) {
    this.ball.bouncePaddle();
  }
};

ServerGameController.prototype.ballGoesOutOfPlay = function(){
  if (this.ball.x >= this.gameBox.width) {
    this.player1.increaseScore();
    this.ball.reset();
  } else if (this.ball.x <= this.gameBox.x) {
    this.player2.increaseScore();
    this.ball.reset();
  }
};

ServerGameController.prototype.assignWinner = function(){
  if (this.player1.score > 9) {
    this.winner = this.player1;
    this.isGameEnded = true;
  } else if (this.player2.score > 9) {
    this.winner = this.player2;
    this.isGameEnded = true;
  }
};

ServerGameController.prototype.getPlayerScores = function() {
  return {
    player1:{id: this.player1.id, score: this.player1.getScore()},
    player2:{id: this.player2.id, score: this.player2.getScore()}
  };
};

ServerGameController.prototype.playerById = function(id) {
	if (this.player1 && this.player1.id === id) {
    return this.player1;
  }
  if (this.player2 && this.player2.id === id) {
    return this.player2;
  }
	return false;
};

module.exports = ServerGameController;
