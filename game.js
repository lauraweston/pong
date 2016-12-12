var express = require("express");
var path = require("path");
var app = express();
var server = require('http').Server(app);
var util = require('util');
var io = require('socket.io')
var Player = require("./src/remotePlayer").Player;
var Paddle = require("./src/remotePaddle").Paddle;
// var GameBox = require('./src/gameBox.js');
var ServerBall = require('./src/serverBall.js');
var ServerGameController = require('./src/serverGameController.js'); //TODO add game controller function in here
var socket;
var players;
var ball;
var gameController;

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/pong.html');
});

function addNewPlayerToGame(newPlayerId) {
  console.log("Adding new player: " + newPlayerId);
  console.log("Current players: " + players.length);

  if(players.length === 2) {
    console.log('Already 2 players in game so exiting');
    return;
  }

  var playerIsOnLeft = players.length === 0 || !players[0].isOnLeft;
  var startingX = playerIsOnLeft ? 15 : 570;
  var newPaddle = new Paddle(startingX, 150);
  var newPlayer = new Player(newPaddle, newPlayerId, playerIsOnLeft);

  players.push(newPlayer);

};

function updatePlayerName(data){
  var updateNamePlayer = playerById(this.id)
  updateNamePlayer.setName(data.username)
  if (players.length === 2 && (players[0].name.length > 0 ) && (players[1].name.length >0)) {
    startGame()
  }
};

function startGame(){
  console.log("starting game");
  ball = new ServerBall();
  var playerData = players.map(function(p) {
    return {
      id: p.id,
      name: p.name,
      x: p.paddle.getX(),
      y: p.paddle.getY(),
    };
  });
  var startingGameData = {
    players: playerData,
    ballCoordinates: ball.getCoordinates()
  };
  gameController = new ServerGameController(ball, players[0], players[1]);
socket.sockets.emit("start game", startingGameData);
console.log(startingGameData);
}


function onMovePlayer(data) {
  var movePlayer = playerById(this.id);
  movePlayer.paddle.setY(data.y);
	this.broadcast.emit("server moves player", {id: movePlayer.id, x: movePlayer.paddle.getX(), y: movePlayer.paddle.getY()});
};


function updateGameController() {
  gameController.update();
  this.emit("draw game", {coordinates: ball.getCoordinates()});
};

function onSocketConnection(client) {
   util.log("New player has connected: "+ client.id);
   client.on("client moves player", onMovePlayer);
   client.on("update game controller", updateGameController);
   client.on("user sign in", updatePlayerName)
   addNewPlayerToGame(client.id);
};

function setEventHandlers () {
  socket.sockets.on('connection', onSocketConnection);
}

(function init() {
  players = [];
  socket = io.listen(server);
  setEventHandlers();
})();

function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id === id)
			return players[i];
	};
	return false;
};
