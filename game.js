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
  util.log("Player has disconnected: "+this.id);
  var removePlayer = playerById(this.id)
  players.splice(players.indexOf(removePlayer), 1);
  this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
  var newPaddle = new Paddle(data.x, data.y);
  var newPlayer = new Player(newPaddle);
  newPlayer.id = this.id;

  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.paddle.getX(), y: newPlayer.paddle.getY()});

  var existingPlayer;

  for(var i=0; i <players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player",  {id: existingPlayer.id, x: existingPlayer.paddle.getX(), y: existingPlayer.paddle.getY()});
  }
  players.push(newPlayer);

  if (players.length === 2) {
    this.broadcast.emit("start game");
    this.emit("start game");
  }
};

function onMovePlayer(data) {
  var movePlayer = playerById(this.id);
  movePlayer.paddle.setY(data.y);
	this.broadcast.emit("move player", {id: movePlayer.id, y: movePlayer.paddle.getY()});
};


function onSocketConnection(client) {
   util.log("New player has connected: "+ client.id);
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
