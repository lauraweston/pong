var util = require('util');
var Player = require("./serverPlayer.js");
var Paddle = require("./serverPaddle.js");
var Ball = require('./serverBall.js');
var ServerGameController = require('./serverGameController.js');
var SocketEventListener = require('../socketEvents/socketEventListener.js');
var SocketEventEmitter = require('../socketEvents/socketEventEmitter.js');

var socket;
var socketEventListener;
var gameController;

function init(s) {
  gameController = new ServerGameController(Ball, Player, Paddle);
  socket = s;
  socketEventListener = new SocketEventListener(socket);
  socketEventListener.setEventHandlers(gameController);
};

module.exports = init;
