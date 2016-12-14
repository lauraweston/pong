function View() {
  this.pong = document.getElementById('pong');
  this.signInForm = document.getElementById('signIn');
  this.newPlayerName = document.getElementById('playerName');
  this.waiting = document.getElementById('waiting');
  this.disconnect = document.getElementById('disconnect');
  this.winner = document.getElementById('winner');
  this.playAgain = document.getElementById('playAgain');
  this.canvas = document.getElementById("canvas");
  this.winnerHolder = document.getElementById("winnerHolder");
  this.gameStart = document.getElementById('countdown');
}

View.prototype.startGameView = function() {
  this._showCanvas();
  this._hideHeading();
  this._hideWaiting();
  this._hideDisconnect();
  this._hideWinner();
  this._wipeWinner();
}

View.prototype.declareWinnerView = function(winner) {
  this.winnerHolder.innerHTML = winner + " wins!"
  this._showWinner();
  this._showPlayAgain();
  this.gameStart.innerHTML = "Game Over!";
}

View.prototype._showHeading = function() {
  this.pong.style.display = 'inline';
}

View.prototype._hideHeading = function() {
  this.pong.style.display = 'none';
}

View.prototype._showSignInForm = function() {
  this.signInForm.style.display = 'inline';
}

View.prototype._hideSignInForm = function() {
  this.signInForm.style.display = 'none';
}

View.prototype._showWaiting = function() {
  this.waiting.style.display = 'inline';
}

View.prototype._hideWaiting = function() {
  this.waiting.style.display = 'none';
}

View.prototype._showDisconnect = function() {
  this.disconnect.style.display = 'inline';
}

View.prototype._hideDisconnect = function() {
  this.disconnect.style.display = 'none';
}

View.prototype._showWinner = function() {
  this.winner.style.display = 'inline';
}

View.prototype._hideWinner = function() {
  this.winner.style.display = 'none';
}

View.prototype._wipeWinner = function() {
  this.winner.innerHTML = "";
}

View.prototype._showPlayAgain = function() {
  this.playAgain.style.display = 'inline';
}

View.prototype._hidePlayAgain = function() {
  this.playAgain.style.display = 'none';
}

View.prototype._hideCanvas = function() {
  this.canvas.style.display = 'none';
}
View.prototype._showCanvas = function() {
  this.canvas.style.display = 'inline';
}

module.exports = View;
