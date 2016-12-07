var express = require("express");
var path = require("path");
var app = express();
var server = require('http').Server(app);
var util = require('util');
var io = require('socket.io')(server);

var socket;
var players;

server.listen(3000);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/pong.html');
});


function onClientDisconnect() {
   util.log("Player has disconnected: "+this.id);
};

function onNewPlayer(data) {

};

function onMovePlayer(data) {

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
  console.log(server);
  socket = io.listen(server);
  setEventHandlers();
})();

io.on('connection', function (socket) {

});
