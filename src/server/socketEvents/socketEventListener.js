var util = require('util');

function SocketEventListener (socket) {
  this.socket = socket;
}

SocketEventListener.prototype.setEventHandlers = function(gameController) {
  this.gameController = gameController;
  this.socket.sockets.on('connection', this.onSocketConnection);
};

SocketEventListener.prototype.onSocketConnection = function(client) {
   util.log("New player has connected: "+ client.id);
   this.gameController.addNewPlayerToGame(client.id);
   client.on("player sign in", this.onSignIn);
   client.on("client moves player", this.onMovePlayer);
   client.on('play again', this.onPlayAgain);
   client.on('disconnect', this.onClientDisconnect);
};

SocketEventListener.prototype.onSignIn = function(data, this) {
  this.gameController.updatePlayerName(data);
};

SocketEventListener.prototype.onMovePlayer = function(data, this) {
  this.gameController.movePlayer(data);
};

SocketEventListener.prototype.onPlayAgain = function(this) {
  this.gameController.playAgain();
};

SocketEventListener.prototype.onClientDisconnect = function(this) {
  this.gameController.onClientDisconnect();
};

module.exports = SocketEventListener;
