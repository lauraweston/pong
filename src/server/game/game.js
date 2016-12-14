var ServerGameController = require('./serverGameController.js');
var SocketEventListener = require('../socketEvents/socketEventListener.js');

function init(io) {
  var gameController = new ServerGameController();
  var socketEventListener = new SocketEventListener(io, gameController);
  socketEventListener.setEventHandlers();
};

module.exports = {
  init: init
};
