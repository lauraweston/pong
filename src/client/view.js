function View() {
  this.pong = document.getElementById('pong');
  this.signInForm = document.getElementById('signIn');
  this.newPlayerName = document.getElementById('playerName');
  this.waiting = document.getElementById('waiting');
  this.disconnect = document.getElementById('disconnect');
  this.winner = document.getElementById('winner');
  this.playAgain = document.getElementById('playAgain');
  this.canvas = document.getElementById("canvas");
  this.gameStatus = document.getElementById('countdown');
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
  this.winner.innerHTML = winner + " wins!"
  this._showWinner();
  this._showPlayAgain();
  this._setGameStatusToOver();
}

View.prototype.removePlayerView = function() {
  this._showDisconnect();
  this._hideWinner();
  this._showPlayAgain();
  this._setGameStatusToOver();
}

View.prototype.afterSignInFormView = function(){
  this._showWaiting();
  this._hideSignInForm();
}

View.prototype.afterPlayAgain = function(){
  this._hideDisconnect();
  this._showWaiting();
  this._hideWinner();
  this._hidePlayAgain();
  this._hideCanvas();
}

View.prototype._setGameStatusToOver = function(){
 this.gameStatus.innerHTML = "Game Over!";
 }

View.prototype.setGameStatusToCountdown = function(){
  var self = this;
  setTimeout(function() {self.gameStatus.innerHTML="5"}, 1000);
  setTimeout(function() {self.gameStatus.innerHTML="4"}, 2000);
  setTimeout(function() {self.gameStatus.innerHTML="3"}, 3000);
  setTimeout(function() {self.gameStatus.innerHTML="2"}, 4000);
  setTimeout(function() {self.gameStatus.innerHTML="1"}, 5000);
}

View.prototype.setGameStatusToPlay = function() {
  this.gameStatus.innerHTML = "Play!";
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
