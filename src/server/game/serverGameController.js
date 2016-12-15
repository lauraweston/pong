var Ball = require("./serverBall.js");
var Player = require("./serverPlayer.js");
var Paddle = require("./serverPaddle.js");

var ServerGameController = function(socketEventEmitter){
  this.eventEmitter = socketEventEmitter;
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
    console.log("Already 2 players in game so exiting");
    return;
  }
  if (!this.player1) {
    this.player1 = new Player(this.paddle1, newPlayerId);
  } else {
    this.player2 = new Player(this.paddle2, newPlayerId);
  }
};

ServerGameController.prototype.updatePlayerName = function(data, playerId){
  var playerToBeUpdated = this.playerById(playerId);
  playerToBeUpdated.setName(data.playerName);
  if (this.player1 && this.player2 && (this.player1.name.length > 0 ) && (this.player2.name.length > 0) && this.player1.isReady && this.player2.isReady) {
    console.log("Starting game");
    this.startGame();
  }
};

ServerGameController.prototype.startGame = function() {
  this.ball.reset();
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
  this.eventEmitter.emitStartGameEvent(startingGameData);
  this._afterCountdownGameStart();
};

ServerGameController.prototype._afterCountdownGameStart = function(){
  var self = this;
  setTimeout(function() {
    self.startGameLoop();
  }, 6000);
}

ServerGameController.prototype.startGameLoop = function() {
  this.resetPlayerReadyState();
  var self = this;
  var gameLoop = function() {
    self.update();
    self.emitEvents();

    var winner = self.getWinner();
    if (winner){
      self.eventEmitter.emitGameWonEvent({winner: winner});
      self.endGameLoop();
    } else {
      self.gameLoopTimeout = setTimeout(gameLoop, self.gameLoopInterval);
    }
  };
  gameLoop();
};//TODO: this is untested

ServerGameController.prototype.emitEvents = function() {
  this.eventEmitter.emitServerMoveBallEvent(this.ball.getCoordinates());
  this.eventEmitter.emitServerUpdateScoreEvent(this.getPlayerScores());
  if(this.ball.paddleSound === true){
    this.eventEmitter.emitPaddleSound();
  }
  if(this.ball.wallSound === true){
    this.eventEmitter.emitWallSound();
  }
  if(this.ball.outSound === true){
    this.eventEmitter.emitOutSound();
  }
};

ServerGameController.prototype.endGameLoop = function() {
  if(this.gameLoopTimeout) {
    clearTimeout(this.gameLoopTimeout);
  }
};

ServerGameController.prototype.removePlayer = function(playerId){
  console.log("Player has disconnected: " + playerId);
  var disconnectedPlayer = this.playerById(playerId);
  var remainingPlayer = this.getOpponent(playerId);
  if (disconnectedPlayer === this.player1) {
    this.player1 = undefined;
  } else {
    this.player2 = undefined;
  }
  this.eventEmitter.emitRemoveOpponentEventToPlayer(remainingPlayer.id);
  this.endGameLoop();
};

ServerGameController.prototype.playAgain = function(playerId) {
  var playerToReset = this.playerById(playerId);
  playerToReset.reset();
  if (this.player1 && this.player2 && this.player1.isReady && this.player2.isReady) {
    this.startGame();
  }
};

ServerGameController.prototype.resetPlayerReadyState = function() {
  this.player1.setPlayerReady(false);
  this.player2.setPlayerReady(false);
};

ServerGameController.prototype.movePlayer = function(data, playerId) {
  var movePlayer = this.playerById(playerId);
  movePlayer.paddle.setY(data.y);

  var playerToBeNotified = this.getOpponent(playerId);

  var playerMoveData = {id: movePlayer.id, x: movePlayer.paddle.getX(), y: movePlayer.paddle.getY()};
  this.eventEmitter.emitOpponentMoveEventToPlayer(playerToBeNotified.id, playerMoveData);
};

ServerGameController.prototype.update = function(){
  this.ball.resetSounds();
  this.ball.update();
  this.ballHitsWall();
  this.ballHitsPaddle();
  this.ballGoesOutOfPlay();
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

ServerGameController.prototype.getWinner = function(){
  if (this.player1.score > 9) {
    return this.player1;
  }
  if (this.player2.score > 9) {
    return this.player2;
  }
  return null;
};

ServerGameController.prototype.getPlayerScores = function() {
  return {
    player1:{id: this.player1.id, score: this.player1.getScore()},
    player2:{id: this.player2.id, score: this.player2.getScore()}
  };
};

ServerGameController.prototype.getOpponent = function(id) {
  var player = this.playerById(id);
  if (player === this.player1) {
    return this.player2;
  } else if(player === this.player2){
    return this.player1;
  }
	return false;
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
