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
   client.on("player sign in", this.gameController.updatePlayerName);
   client.on("client moves player", this.gameController.onMovePlayer);
   client.on('play again', this.gameController.onPlayAgain);
   client.on('disconnect', this.gameController.onClientDisconnect);
};

module.exports = SocketEventListener;
