function SocketEventEmitter(socket) {
  this.socket = socket;
}

SocketEventEmitter.prototype.signIn = function(value) {
  this.socket.emit('player sign in', {playerName: value});
};

module.exports = SocketEventEmitter
