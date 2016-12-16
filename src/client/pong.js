var eventListeners = require('./eventListeners.js');
var Pong = require('./clientGame.js');
var SocketEmitter = require('./eventEmitters.js');

(function init(){
  var socket = io.connect(getUrl());
  var pong = new Pong(socket, emitters)
  var emitters = new SocketEmitter(socket)
  var listeners = new eventListeners(pong, socket)
  listeners.setEventHandlers();
  pong.init()
})()

function getUrl() {
  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}
