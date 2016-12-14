var ServerGameController = require('./serverGameController.js');
var SocketEventListener = require('../socketEvents/socketEventListener.js');
var SocketEventEmitter = require('../socketEvents/socketEventEmitter.js');

function init(s) {
  var gameController = new ServerGameController();
  var socket = s;
  var socketEventListener = new SocketEventListener(socket);
  socketEventListener.setEventHandlers(gameController);
};

module.exports = init;
