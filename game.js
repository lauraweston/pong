var express = require("express");
var path = require("path");
var app = express();
var server = require('http').Server(app);
var util = require('util');
<<<<<<< HEAD
var io = require('socket.io')
var Player = require("./src/remotePlayer").Player;
var Paddle = require("./src/remotePaddle").Paddle;
// var GameBox = require('./src/gameBox.js');
var ServerBall = require('./src/serverBall.js');
var ServerGameController = require('./src/serverGameController.js'); //TODO add game controller function in here
var socket;
var players;
=======
var io = require('socket.io');
var Player = require("./src/remotePlayer.js");
var Paddle = require("./src/remotePaddle.js");
var ServerBall = require('./src/serverBall.js');
var ServerGameController = require('./src/serverGameController.js');

var socket;
var player1;
var player2;
>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
var ball;
var gameController;

server.listen(3000, '0.0.0.0');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/pong.html');
});

function addNewPlayerToGame(newPlayerId) {
  console.log("Adding new player: " + newPlayerId);

  if (player1 && player2) {
    console.log('Already 2 players in game so exiting');
    return;
  }

  if (!player1) {
    var paddle = new Paddle(15, 150);
    player1 = new Player(paddle, newPlayerId);
  } else {
    var paddle = new Paddle(570, 150);
    player2 = new Player(paddle, newPlayerId);
  }
}

function updatePlayerName(data){
<<<<<<< HEAD
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
=======
  var updateNamePlayer = playerById(this.id);
  updateNamePlayer.setName(data.username);
  if (player1 && player2 && (player1.name.length > 0 ) && (player2.name.length > 0)) {
    console.log("Starting game");
    startGame();
  }
}

function startGame() {
  ball = new ServerBall();
  var playerData = [
    {
      id: player1.id,
      name: player1.name,
      x: player1.paddle.getX(),
      y: player1.paddle.getY()
    },
    {
      id: player2.id,
      name: player2.name,
      x: player2.paddle.getX(),
      y: player2.paddle.getY()
    }
  ];

>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
  var startingGameData = {
    players: playerData,
    ballCoordinates: ball.getCoordinates()
  };
<<<<<<< HEAD
  gameController = new ServerGameController(ball, players[0], players[1]);
socket.sockets.emit("start game", startingGameData);
console.log(startingGameData);
=======
  gameController = new ServerGameController(ball, player1, player2, onGameLoopTick);
  socket.sockets.emit("start game", startingGameData);
  gameController.startGameLoop();
>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
}

function onGameLoopTick() {
  socket.sockets.emit("server moves ball", ball.getCoordinates());
  socket.sockets.emit("server updates scores", gameController.getPlayerScores())
}

function onMovePlayer(data) {
  var movePlayer = playerById(this.id);
  movePlayer.paddle.setY(data.y);
	this.broadcast.emit("server moves player", {id: movePlayer.id, x: movePlayer.paddle.getX(), y: movePlayer.paddle.getY()});
<<<<<<< HEAD
};

=======
}
>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d

function updateGameController() {
  gameController.update();
  this.emit("draw game", {coordinates: ball.getCoordinates()});
};

function onSocketConnection(client) {
   util.log("New player has connected: "+ client.id);
<<<<<<< HEAD
   client.on("client moves player", onMovePlayer);
   client.on("update game controller", updateGameController);
   client.on("user sign in", updatePlayerName)
=======
   client.on("user sign in", updatePlayerName);
   client.on("client moves player", onMovePlayer);
>>>>>>> 695eba5ab3867bc3906fe25dee70a35e1f9c940d
   addNewPlayerToGame(client.id);
}

function setEventHandlers() {
  socket.sockets.on('connection', onSocketConnection);
}

(function init() {
  socket = io.listen(server);
  setEventHandlers();
})();

function playerById(id) {
	if (player1.id === id) {
    return player1;
  }
  if (player2.id === id) {
    return player2;
  }
	return false;
}
