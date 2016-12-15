var ServerGameController = require('./serverGameController.js');
var SocketEventListener = require('../socketEvents/socketEventListener.js');
var SocketEventEmitter = require('../socketEvents/socketEventEmitter.js');

function init(io) {
  var socketEventEmitter = new SocketEventEmitter(io);
  var gameController = new ServerGameController(socketEventEmitter);
  var socketEventListener = new SocketEventListener(io, gameController);
  socketEventListener.setEventHandlers();
};

module.exports = {
  init: init
};
