var express = require("express");
var path = require("path");
var app = express();
var server = require('http').Server(app);
var util = require('util');
var io = require('socket.io')
var Player = require("./remotePlayer").Player;
var Paddle = require("./remotePlayer").Paddle;


var socket;
var players;

server.listen(3000);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/pong.html');
});

function onClientDisconnect() {
  var removePlayer = playerById(this.id)
  players.splice(players.indexOf(removePlayer), 1);
  this.broadcast.emit("remove player", {id: this.id});
  util.log("Player has disconnected: "+this.id);
};

function onNewPlayer(data) {
  var newPaddle = new Paddle();
  var newPlayer = new Player(newPaddle);
  newPlayer.id = this.id;

  this.broadcast.emit("New player", {id: newPlayer.id, y: newPlayer.paddle.getY(), x: newPlayer.paddle.getX()});

  var existingPlayer;

  for(var i=0; i <players.length; i++) {
    existingPlayer = Player[i];
    this.emit("New player",  {id: existingPlayer.id, x: existingPlayer.paddle.getX(), y: existingPlayer.paddle.getY()});
  }
  players.push(newPlayer);
};

function onMovePlayer(data) {
  var movePlayer = playerById(this.id);
  movePlayer.paddle.setY(data.paddle.y);
	this.broadcast.emit("move player", {id: movePlayer.id, y: movePlayer.paddle.getY()});
};

function onSocketConnection(client) {
   util.log("New player has connected: "+client.id);
   client.on("disconnect", onClientDisconnect);
   client.on("new player", onNewPlayer);
   client.on("move player", onMovePlayer);
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
		if (players[i].id == id)
			return players[i];
	};
	return false;
};
