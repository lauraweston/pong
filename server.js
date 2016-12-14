var express = require("express");
var path = require("path");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io');
var init = require('./src/server/game/game.js');

server.listen(3000, '0.0.0.0');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/pong.html');
});

var socket = io.listen(server);

init(socket);
