<<<<<<< HEAD
var ServerGameController = function(ball, player1, player2){
=======
var ServerGameController = function(ball, player1, player2, gameLoopTickCallback){
>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
  this.ball = ball;
  this.player1 = player1;
  this.player2 = player2;
  this.gameBox = {
                  height: 400,
                  width:  600,
                  x:        0,
                  y:        0
  };
<<<<<<< HEAD
};

=======
  this.gameLoopInterval = 8;
  this.gameLoopTickCallback = gameLoopTickCallback;
};

  ServerGameController.prototype.startGameLoop = function() {
    var self = this;
    var gameLoopTick = function() {
      self.update();
      self.gameLoopTickCallback();
      self.gameLoop = setTimeout(gameLoopTick, self.gameLoopInterval);
    };
    gameLoopTick();
  }

>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
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
<<<<<<< HEAD
      // this.player2.increaseScore();
      this.ball.reset();
    } else if (this.ball.x <= this.gameBox.x) {
      // this.player1.increaseScore();
=======
      this.player2.increaseScore();
      this.ball.reset();
    } else if (this.ball.x <= this.gameBox.x) {
      this.player1.increaseScore();
>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
      this.ball.reset();
    }
  };

  ServerGameController.prototype.update = function(){
    this.ball.update();
    this.ballHitsWall();
    this.ballHitsPaddle();
    this.ballGoesOutOfPlay();
  };

<<<<<<< HEAD
=======
  ServerGameController.prototype.getPlayerScores = function() {
    return {
      player1Score: this.player1.getScore(),
      player2Score: this.player2.getScore()
    };
  };

>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
  module.exports = ServerGameController;
