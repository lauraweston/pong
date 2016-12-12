var GameController = function(ball, gamebox, localPlayer, opponent){
  this.ball = ball;
  this.gameBox = gamebox;
  this.localPlayer = localPlayer;
  this.opponent = opponent;
};

  GameController.prototype.drawGame = function(){
    this.gameBox.draw();
    console.log('ball in gameController')
    console.log(this.ball);
    this.ball.draw();
    this.localPlayer.draw();
    this.opponent.draw();
  };

  GameController.prototype.setScores = function(scores) {
    console.log(scores)

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

  module.exports = GameController;
