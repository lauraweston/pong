var GameController = function(ball, gamebox, player1, player2){
  this.ball = ball;
  this.gameBox = gamebox;
  this.player1 = player1;
  this.player2 = player2;
};

  GameController.prototype.drawGame = function(){
    this.gameBox.draw();
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
