var GameController = function(ball, gamebox, localPlayer, opponent){
  this.ball = ball;
  this.gameBox = gamebox;
  this.localPlayer = localPlayer;
  this.opponent = opponent;
  this.isGameEnded = false
};

  GameController.prototype.drawGame = function(){
    this.gameBox.draw();
    this.ball.draw();
    this.localPlayer.draw();
    this.opponent.draw();
  };

  GameController.prototype.setScores = function(scores) {
    if (this.localPlayer.id === scores.player1.id) {
      var localPlayerScore = scores.player1.score;
      this.localPlayer.setScore(localPlayerScore);
      var opponentScore = scores.player2.score;
      this.opponent.setScore(opponentScore);
    } else {
      var localPlayerScore = scores.player2.score;
      this.localPlayer.setScore(localPlayerScore);
      var opponentScore = scores.player1.score;
      this.opponent.setScore(opponentScore);
    }
  };

  GameController.prototype.endGame = function(){
    this.isGameEnded = true
  }

  GameController.prototype.resetGame = function(){
    this.isGameEnded = false
  }

  module.exports = GameController;
