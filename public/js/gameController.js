var GameController = function(ball, gamebox, player1, player2){
  this.ball = ball;
  this.gameBox = gamebox;
  this.player1 = player1;
  this.player2 = player2;
};

  // GameController.prototype.ballHitsPaddle = function(){
  //   if(this.ball.x > this.player1.paddle.x && this.ball.x < (this.player1.paddle.x + this.player1.paddle.width) && (this.ball.y >= this.player1.paddle.y && this.ball.y <= (this.player1.paddle.y + this.player1.paddle.height))) {
  //     this.ball.bouncePaddle();
  //   }
  //   if(this.ball.x > this.player2.paddle.x && this.ball.x < (this.player2.paddle.x + this.player2.paddle.width) && (this.ball.y >= this.player2.paddle.y && this.ball.y <= (this.player2.paddle.y + this.player2.paddle.height))) {
  //     this.ball.bouncePaddle();
  //   }
  // };
  //
  // GameController.prototype.ballHitsWall = function(){
  //   if(this.ball.y <= this.gameBox.y || this.ball.y > this.gameBox.height) {
  //     this.ball.bounceWall();
  //   }
  // };
  //
  // GameController.prototype.ballGoesOutOfPlay = function(){
  //   if (this.ball.x >= this.gameBox.width) {
  //     this.player2.increaseScore();
  //     this.ball.reset();
  //   } else if (this.ball.x <= this.gameBox.x) {
  //     this.player1.increaseScore();
  //     this.ball.reset();
  //   }
  // };
  //
  // GameController.prototype.update = function(){
  //   this.ball.update();
  //   this.ballHitsWall();
  //   this.ballHitsPaddle();
  //   this.ballGoesOutOfPlay();
  // };

  GameController.prototype.drawGame = function(){
    this.gameBox.draw();
    this.ball.draw();
    this.player1.paddle.draw();
    this.player2.paddle.draw();
    this.player1.draw();
    this.player2.draw();
  };


  module.exports = GameController;
