function setEventHandlers() {
  socket.on("connect", onSocketConnected);
  socket.on("start game", startGame);
  socket.on("server moves ball", onServerMovesBall);
  socket.on("server moves player", onServerMovePlayer);
  socket.on("server updates scores", onServerUpdatesScores);
  socket.on("game won", declareWinner);
  socket.on("disconnect", onSocketDisconnect);
  socket.on("remove player", removePlayer);
}

function onSocketConnected() {
  console.log("Connected to socket server");
}

function onServerMovesBall(data) {
  localBall.setCoordinates(data);
}

function onServerMovePlayer(data) {
  if (data.id === opponent.id) {
    opponent.paddle.setY(data.y);
  }
}

function onServerUpdatesScores(data) {
  gameController.setScores(data);
}

function declareWinner(data){
  gameController.endGame();
  view.declareWinnerView(data.winner.name);
}

function onSocketDisconnect() {
  console.log("Disconnected from socket server");
}

function removePlayer(){
  gameController.endGame();
  view.removePlayerView();
}
