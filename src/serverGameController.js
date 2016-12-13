var ServerGameController = function(ball, player1, player2, gameLoopTickCallback){
  this.ball = ball;
  this.player1 = player1;
  this.player2 = player2;
  this.gameBox = {
                  height: 400,
                  width:  600,
                  x:        0,
                  y:        0
  };
  this.gameLoopInterval = 8;
  this.gameLoopTickCallback = gameLoopTickCallback;
  this.isGameEnded = false;
};

  ServerGameController.prototype.startGameLoop = function() {
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
  }

  ServerGameController.prototype.endGameLoop = function() {
    this.isGameEnded = true;
  };


  ServerGameController.prototype.ballHitsPaddle = function(){
    if(this.ball.x > this.player1.paddle.x && this.ball.x < (this.player1.paddle.x + this.player1.paddle.width) && (this.ball.y >= this.player1.paddle.y && this.ball.y <= (this.player1.paddle.y + this.player1.paddle.height))) {
      this.ball.bouncePaddle();
    }
    if(this.ball.x > this.player2.paddle.x && this.ball.x < (this.player2.paddle.x + this.player2.paddle.width) && (this.ball.y >= this.player2.paddle.y && this.ball.y <= (this.player2.paddle.y + this.player2.paddle.height))) {
      this.ball.bouncePaddle();
    }
  };

  ServerGameController.prototype.ballHitsWall = function(){
    if(this.ball.y <= this.gameBox.y || this.ball.y > this.gameBox.height) {
      this.ball.bounceWall();
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

  ServerGameController.prototype.update = function(){
    this.ball.update();
    this.ballHitsWall();
    this.ballHitsPaddle();
    this.ballGoesOutOfPlay();
    this.assignWinner();
  };

  ServerGameController.prototype.getPlayerScores = function() {
    return {
      player1:{id: this.player1.id, score: this.player1.getScore()},
      player2:{id: this.player2.id, score: this.player2.getScore()}
    };
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

  module.exports = ServerGameController;
