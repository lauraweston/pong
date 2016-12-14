var util = require('util');

function SocketEventListener(io, gameController) {
  this.io = io;
  this.gameController = gameController;
}

SocketEventListener.prototype.setEventHandlers = function() {
  var eventListener = this;
  this.io.sockets.on('connection', function(socket) {
    eventListener.onSocketConnection(socket);
  });
};

SocketEventListener.prototype.onSocketConnection = function(socket) {
  var io = this.io;
  var gameController = this.gameController;

  util.log("New player has connected: " + socket.id);

  gameController.addNewPlayerToGame(socket.id);

  socket.on("player sign in", function(data) {
    gameController.updatePlayerName(data, socket);
  });

  socket.on("client moves player", function(data) {
    gameController.movePlayer(data, socket);
  });

  socket.on('play again', function() {
    gameController.playAgain(socket);
  });

  socket.on('disconnect', function() {
    gameController.removePlayer(socket);
  });
};

module.exports = SocketEventListener;
