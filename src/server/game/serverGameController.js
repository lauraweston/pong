var Ball = require("./serverBall.js");
var Player = require("./serverPlayer.js");
var Paddle = require("./serverPaddle.js");

var gamePlayerHelpers = require("./gamePlayerHelpers.js");
var getPlayerScores = gamePlayerHelpers.getPlayerScores;
var getWinner = gamePlayerHelpers.getWinner;
var getOpponent = gamePlayerHelpers.getOpponent;
var getPlayerById = gamePlayerHelpers.getPlayerById;

var ballPhysicsEngine = require("./ballPhysicsEngine.js");
var ballHitsWall = ballPhysicsEngine.ballHitsWall;
var ballHitsPaddle = ballPhysicsEngine.ballHitsPaddle;
var ballGoesOutOfPlay = ballPhysicsEngine.ballGoesOutOfPlay;

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
  var playerToBeUpdated = getPlayerById(playerId, this.player1, this.player2);
  playerToBeUpdated.setName(data.playerName);
  if (this.player1 && this.player2 && this.player1.isAssignedName() && this.player2.isAssignedName() && this.player1.isReady && this.player2.isReady) {
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

    var winner = getWinner(self.player1, self.player2);
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
  this.eventEmitter.emitServerUpdateScoreEvent(getPlayerScores(this.player1, this.player2));
  if(this.ball.paddleSound === true){
    this.eventEmitter.emitPaddleSound();
  }
  if(this.ball.wallSound === true){
    this.eventEmitter.emitWallSound();
  }
};

ServerGameController.prototype.endGameLoop = function() {
  if(this.gameLoopTimeout) {
    clearTimeout(this.gameLoopTimeout);
  }
};

ServerGameController.prototype.removePlayer = function(playerId){
  console.log("Player has disconnected: " + playerId);
  var disconnectedPlayer = getPlayerById(playerId, this.player1, this.player2);
  var remainingPlayer = getOpponent(playerId, this.player1, this.player2);
  if (disconnectedPlayer === this.player1) {
    this.player1 = undefined;
  } else {
    this.player2 = undefined;
  }
  this.eventEmitter.emitRemoveOpponentEventToPlayer(remainingPlayer.id);
  this.endGameLoop();
};

ServerGameController.prototype.playAgain = function(playerId) {
  var playerToReset = getPlayerById(playerId, this.player1, this.player2);
  playerToReset.reset();
  if (this.player1 && this.player2 && this.player1.isAssignedName() && this.player2.isAssignedName() && this.player1.isReady && this.player2.isReady) {
    this.startGame();
  }
};

ServerGameController.prototype.resetPlayerReadyState = function() {
  this.player1.setPlayerReady(false);
  this.player2.setPlayerReady(false);
};

ServerGameController.prototype.movePlayer = function(data, playerId) {
  var movePlayer = getPlayerById(playerId, this.player1, this.player2);
  movePlayer.paddle.setY(data.y);

  var playerToBeNotified = getOpponent(playerId, this.player1, this.player2);

  var playerMoveData = {id: movePlayer.id, x: movePlayer.paddle.getX(), y: movePlayer.paddle.getY()};
  this.eventEmitter.emitOpponentMoveEventToPlayer(playerToBeNotified.id, playerMoveData);
};

ServerGameController.prototype.update = function(){
  this.ball.resetSounds();
  this.ball.update();
  ballHitsWall(this.ball, this.gameBox);
  ballHitsPaddle(this.ball, this.player1, this.player2);
  ballGoesOutOfPlay(this.ball, this.gameBox, this.player1, this.player2);
};

module.exports = ServerGameController;
