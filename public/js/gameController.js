var GameController = function(ball, gamebox, player1, player2){
  this.ball = ball;
  this.gameBox = gamebox;
  this.player1 = player1;
  this.player2 = player2;
};

  GameController.prototype.drawGame = function(){
    this.gameBox.draw();
    this.ball.draw();
    this.player1.paddle.draw();
    this.player2.paddle.draw();
    this.player1.draw();
    this.player2.draw();
  };


  module.exports = GameController;
