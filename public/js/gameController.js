var GameController = function(ball, gameBox, player1, player2){
  this.ball = ball;
  this.gameBox = gameBox;
  this.player1 = player1;
  this.player2 = player2;
};

  GameController.prototype.drawGame = function(){
    this.gameBox.draw();
    console.log('ball in gameController')
    console.log(this.ball);
    this.ball.draw();
    this.player1.draw();
    this.player2.draw();
  };

  GameController.prototype.setScores = function(scores) {
    var player1Score = scores.player1Score;
    var player2Score = scores.player2Score;
    this.player1.setScore(player1Score);
    this.player2.setScore(player2Score);
  };

  module.exports = GameController;
