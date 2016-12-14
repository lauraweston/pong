var Ball = require('./serverBall.js');
var Player = require("./serverPlayer.js");
var Paddle = require("./serverPaddle.js");
var ServerGameController = require('./serverGameController.js');
var SocketEventListener = require('../socketEvents/socketEventListener.js');
var SocketEventEmitter = require('../socketEvents/socketEventEmitter.js');

function init(s) {
  var gameController = new ServerGameController(Ball, Player, Paddle);
  var socket = s;
  var socketEventListener = new SocketEventListener(socket);
  socketEventListener.setEventHandlers(gameController);
};

module.exports = init;
