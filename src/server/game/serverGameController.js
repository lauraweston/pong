var util = require('util');

var ServerGameController = function(Ball, Player, Paddle){
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

ServerGameController.prototype.updatePlayerName = function(data){
  //TODO: 'this.id' should be the client socket - needs changing
  var playerToBeUpdated = this.playerById(this.id);
  playerToBeUpdated.setName(data.playerName);
  if (this.player1 && this.player2 && (this.player1.name.length > 0 ) && (this.player2.name.length > 0) && this.player1.isReady && this.player2.isReady) {
    console.log("Starting game");
    this.startGame();
  }
};

ServerGameController.prototype.startGame = function() {
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
  socket.sockets.emit("start game", startingGameData);
  this.startGameLoop();
};

ServerGameController.prototype.startGameLoop = function() {
  this.resetPlayerReadyState();
  var self = this;
  var gameLoopTick = function() {
    if (!self.isGameEnded){
      self.update();
      self.gameLoopTickCallback();
      self.gameLoop = setTimeout(gameLoopTick, self.gameLoopInterval);
    } else {
      clearTimeout(self.gameLoop);
    }
  };
  gameLoopTick();
};//this is untested

//TODO: needs access to socket.sockets
ServerGameController.prototype.gameLoopTickCallback = function() {
  socket.sockets.emit("server moves ball", this.ball.getCoordinates());
  socket.sockets.emit("server updates scores", this.getPlayerScores());
  if (this.winner){
    socket.sockets.emit("game won", {winner: this.winner});
  }
};

ServerGameController.prototype.endGameLoop = function() {
  this.isGameEnded = true;
};

ServerGameController.prototype.onClientDisconnect = function(){
  //TODO: 'this.id' should be the client socket - needs changing
  util.log("Player has disconnected: " + this.id);
  var disconnectedPlayer = this.playerById(this.id);
  if (disconnectedPlayer === this.player1) {
    this.player1 = undefined;
  } else {
    this.player2 = undefined;
  }
  this.broadcast.emit("remove player");
  this.endGameLoop();
};

ServerGameController.prototype.onPlayAgain = function() {
  //TODO: 'this.id' should be the client socket - needs changing
  var playerToReset = this.playerById(this.id);
  playerToReset.reset();
  if (this.player1 && this.player2 && this.player1.isReady && this.player2.isReady) {
    this.startGame();
  }
};

ServerGameController.prototype.resetPlayerReadyState = function() {
  this.player1.setPlayStatus(false);
  this.player2.setPlayStatus(false);
};

ServerGameController.prototype.onMovePlayer = function(data) {
  //TODO: 'this.id' should be the client socket - needs changing
  var movePlayer = this.playerById(this.id);
  movePlayer.paddle.setY(data.y);
  //TODO: move to socketEventEmitter; 'this' should be the client socket
  this.broadcast.emit("server moves player", {id: movePlayer.id, x: movePlayer.paddle.getX(), y: movePlayer.paddle.getY()});
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
