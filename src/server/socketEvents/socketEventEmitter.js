function SocketEventEmitter(io) {
  this.io = io;
}

SocketEventEmitter.prototype.emitStartGameEvent = function(startingGameData) {
  this.io.sockets.emit("start game", startingGameData);
};

SocketEventEmitter.prototype.emitServerMoveBallEvent = function(ballCoordinates) {
  this.io.sockets.emit("server moves ball", ballCoordinates);
};

SocketEventEmitter.prototype.emitServerUpdateScoreEvent = function(playerScores) {
  this.io.sockets.emit("server updates scores", playerScores);
};

SocketEventEmitter.prototype.emitGameWonEvent = function(winner) {
  this.io.sockets.emit("game won", winner);
};

SocketEventEmitter.prototype.emitRemoveOpponentEventToPlayer = function(playerId) {
  this.io.to(playerId).emit("remove player");
};

SocketEventEmitter.prototype.emitOpponentMoveEventToPlayer = function(playerId, opponentMoveData) {
  this.io.to(playerId).emit("server moves player", opponentMoveData);
};

module.exports = SocketEventEmitter;
