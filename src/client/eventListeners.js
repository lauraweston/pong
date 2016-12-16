function ClientSocketEventListener(pong, socket) {
  this.localPong = pong;
  this.socket = socket
}

ClientSocketEventListener.prototype.setEventHandlers = function() {
  var eventListener = this;
  this.socket.on('connect', function() {
    eventListener.onSocketConnected();
  });
  this.socket.on('start game', function(gameData) {
    eventListener.localPong.createPlayers(gameData);
    console.log(gameData);
  });
  this.socket.on('server moves ball', function(data) {
    eventListener.localPong.setBallCoordinates(data);
  });
  this.socket.on('server moves player', function(data) {
    eventListener.localPong.onServerMovePlayer(data);
  });
  this.socket.on('server updates scores', function(data) {
    eventListener.localPong.onServerUpdatesScores(data);
  });
  this.socket.on('game won', function(data) {
    eventListener.localPong.declareWinner(data);
  });
  this.socket.on('disconnect', function() {
    eventListener.onSocketDisconnect();
  });
  this.socket.on('remove player', function(data) {
    eventListener.localPong.removePlayer(data);
  });
  this.socket.on('paddle sound', function(data) {
    eventListener.localPong.onPaddleSmack(data);
  });
  this.socket.on('wall sound', function(data) {
    eventListener.localPong.onWallSmack(data);
  });
  this.socket.on('out sound', function(data) {
    eventListener.localPong.onOutOfBounds(data);
  });

};

ClientSocketEventListener.prototype.onSocketConnected = function() {
  console.log("Connected to socket server");
}

ClientSocketEventListener.prototype.onSocketDisconnect = function() {
  console.log("Disconnected from socket server");
}

module.exports = ClientSocketEventListener;
