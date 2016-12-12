/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameController = __webpack_require__(1);
	var GameBox = __webpack_require__(2);
	var Ball = __webpack_require__(3);
	var Player = __webpack_require__(4);
	var Paddle = __webpack_require__(5);
	var keydown = __webpack_require__(6);
	var animate = __webpack_require__(7);
	__webpack_require__(8);

	var socket;
	var localPlayer;
	var opponent;
	var localBall;
	var context;
	var canvas;
	var gameBox;
	var gameController;
	var gameEnded = false

	var signDiv = document.getElementById('signDiv');
	var play = document.getElementById('signIn');
	var newUsername = document.getElementById('username');
	var waiting = document.getElementById('waiting');
	var disconnect = document.getElementById('disconnect');

	play.onclick = function(){
	  waiting.style.display = 'inline';
	  signDiv.style.display = 'none';
	  socket.emit('user sign in', {username: newUsername.value});
	}

	function onSocketConnected() {
	  console.log("Connected to socket server");
	}

	function onSocketDisconnect() {
		console.log("Disconnected from socket server");
	  socket.emit("disconnect")
	}

	function onServerMovePlayer(data) {
	  if (data.id === opponent.id) {
	    opponent.paddle.setY(data.y);
	  }
	}

	function onServerMovesBall(data) {
	  localBall.setCoordinates(data);
	}

	function onServerUpdatesScores(data) {
	  gameController.setScores(data);
	}

	function setEventHandlers() {
		// Socket connection successful
		socket.on("connect", onSocketConnected);
		// Socket disconnection
		socket.on("disconnect", onSocketDisconnect);
		// Player move message received
		socket.on("server moves player", onServerMovePlayer);
	  socket.on("server moves ball", onServerMovesBall);
	  socket.on("server updates scores", onServerUpdatesScores);
	  socket.on("start game", startGame);
	  socket.on("remove player", removePlayer)
	};

	function removePlayer(){
	  gameEnded = true
	  disconnect.style.display = "inline";
	}

	function myId() {
	  return socket.io.engine.id;
	}

	function startGame(gameData){
	  console.log("Starting game:");
	  waiting.style.display = 'none';
	  for(var i = 0; i < gameData.players.length; i++) {
	    var player = gameData.players[i];
	    var paddle = new Paddle(player.x, player.y, context);
	    if (player.id === myId()) {
	      localPlayer = new Player(paddle, context, player.name);
	      localPlayer.id = myId();
	    } else {
	      opponent = new Player(paddle, context, player.name);
	      opponent.id = player.id;
	    }
	  }
	  localBall = new Ball(context);
	  localBall.setCoordinates(gameData.ballCoordinates);
	  gameController = new GameController(localBall, gameBox, localPlayer, opponent);
	  animate(gameLoop);
	}

	function gameLoop(){
	  checkForPaddleMove();
	  draw();
	  console.log(gameEnded)
	  while(!gameEnded){
	  console.log(gameEnded)
	  animate(gameLoop);
	}
	}

	var draw = function(){
	  gameController.drawGame();
	};

	var lastPaddleMove = 0;
	var checkForPaddleMove = function(){
	  var timeNow = new Date();
	  var timeSinceLastMove = timeNow - lastPaddleMove;

	  if (timeSinceLastMove < 15) {
	    return;
	  }

	  var paddleMoved = false;
	  if (keydown.down) {
	    localPlayer.paddle.moveDown();
	    paddleMoved = true;
	  } else if (keydown.up) {
	    localPlayer.paddle.moveUp();
	    paddleMoved = true;
	  }

	  if (paddleMoved) {
	    socket.emit("client moves player", {y: localPlayer.paddle.getY()});
	    lastPaddleMove = timeNow;
	  }
	};

	(function init(){
	  canvas = document.getElementById("canvas");
	  context = canvas.getContext('2d');
	  gameBox = new GameBox(context);
	  socket = io.connect('http://localhost:3000');
	  setEventHandlers();
	})();


/***/ },
/* 1 */
/***/ function(module, exports) {

	var GameController = function(ball, gamebox, localPlayer, opponent){
	  this.ball = ball;
	  this.gameBox = gamebox;
	  this.localPlayer = localPlayer;
	  this.opponent = opponent;
	};

	  GameController.prototype.drawGame = function(){
	    this.gameBox.draw();
	    this.ball.draw();
	    this.localPlayer.draw();
	    this.opponent.draw();
	  };

	  GameController.prototype.setScores = function(scores) {
	    console.log(scores)

	    if (this.localPlayer.id === scores.player1.id) {
	      var localPlayerScore = scores.player1.score;
	      this.localPlayer.setScore(localPlayerScore);
	      var opponentScore = scores.player2.score;
	      this.opponent.setScore(opponentScore);
	    } else {
	      var localPlayerScore = scores.player2.score;
	      this.localPlayer.setScore(localPlayerScore);
	      var opponentScore = scores.player1.score;
	      this.opponent.setScore(opponentScore);
	    }
	  };

	  module.exports = GameController;


/***/ },
/* 2 */
/***/ function(module, exports) {

	function GameBox(context){
	  this.context = context;
	  this.height = 400;
	  this.width= 600;
	  this.x = 0;
	  this.y = 0;
	};

	GameBox.prototype.draw = function(){
	  this.context.beginPath();
	  this.context.rect(this.x, this.y, this.width, this.height)
	  this.context.fillStyle = "black";
	  this.context.fill();
	  this.context.closePath();
	};

	module.exports = GameBox;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Ball = function(context){
	  this.context = context;
	};

	Ball.prototype.draw = function(){
	  this.context.beginPath();
	  this.context.arc(this.x, this.y, 7, 0, Math.PI*2, true)
	  this.context.fillStyle = "white";
	  this.context.closePath();
	  this.context.fill();
	};

	Ball.prototype.setCoordinates = function (ballCoordinates) {
	  this.x = ballCoordinates.x;
	  this.y = ballCoordinates.y;
	};

	module.exports = Ball;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function Player (paddle, context, name) {
	  this.score = 0;
	  this.id
	  this.paddle = paddle;
	  this.context = context;
	  this.name = name
	}

	Player.prototype.draw = function() {
	  this.paddle.draw();
	  this.paddle.draw();
	  this.context.fillText("vs", 300, 10);
	  this.context.fillText(this.name, this.paddle.x - 10, 10);
	  this.context.fillText(this.score, this.paddle.x, 20);
	};

	Player.prototype.setName = function(name){
	  this.name = name;
	};

	Player.prototype.setScore = function(score){
	  this.score = score;
	};

	module.exports = Player;


/***/ },
/* 5 */
/***/ function(module, exports) {

	function Paddle(x, y, context) {
	  this.color = "white";
	  this.width = 15;
	  this.height = 70;
	  this.x = x;
	  this.y = y;
	  this.ySpeed = 5;
	  this.context = context;
	}

	Paddle.prototype.draw = function() {
	  this.context.fillStyle = this.color;
	  this.context.fillRect(this.x, this.y, this.width, this.height);
	};

	Paddle.prototype.moveDown = function() {
	   if (this.y < 330) {
	     this.y += this.ySpeed;
	   }
	};

	Paddle.prototype.moveUp = function(value) {
	  if (this.y > 0) {
	    this.y -= this.ySpeed;
	  }
	};

	Paddle.prototype.setY = function(y) {
	  this.y = y;
	};

	Paddle.prototype.setX = function(x) {
	  this.x = x;
	};

	Paddle.prototype.getY = function() {
	  return this.y;
	};

	Paddle.prototype.getX = function() {
	  return this.x;
	};

	module.exports = Paddle;


/***/ },
/* 6 */
/***/ function(module, exports) {

	 window.keydown = {};

	 function keyName(event) {
	   return jQuery.hotkeys.specialKeys[event.which] ||
	     String.fromCharCode(event.which).toLowerCase();
	 }

	 $(document).bind("keydown", function(event) {
	   keydown[keyName(event)] = true;
	 });

	 $(document).bind("keyup", function(event) {
	   keydown[keyName(event)] = false;
	 });

	 module.exports = keydown;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var animate = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function (callback) {window.setTimeout(callback, 10000 / 60)};

	module.exports = animate;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
	* jQuery Hotkeys Plugin
	* Copyright 2010, John Resig
	* Dual licensed under the MIT or GPL Version 2 licenses.
	*
	* Based upon the plugin by Tzury Bar Yochay:
	* http://github.com/tzuryby/hotkeys
	*
	* Original idea by:
	* Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
	*/


	module.exports = (function(jQuery){

		jQuery.hotkeys = {
			version: "0.8",

			specialKeys: {
				8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
				20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
				37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
				96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
				104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
				112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
				120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
			},

			shiftNums: {
				"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
				"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
				".": ">",  "/": "?",  "\\": "|"
			}
		};

		function keyHandler( handleObj ) {
			// Only care when a possible input has been specified
			if ( typeof handleObj.data !== "string" ) {
				return;
			}

			var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");

			handleObj.handler = function( event ) {
				// Don't fire in text-accepting inputs that we didn't directly bind to
				if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				event.target.type === "text") ) {
					return;
				}

				// Keypress represents characters, not special keys
				var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

				// check combinations (alt|ctrl|shift+anything)
				if ( event.altKey && special !== "alt" ) {
					modif += "alt+";
				}

				if ( event.ctrlKey && special !== "ctrl" ) {
					modif += "ctrl+";
				}

				// TODO: Need to make sure this works consistently across platforms
				if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
					modif += "meta+";
				}

				if ( event.shiftKey && special !== "shift" ) {
					modif += "shift+";
				}

				if ( special ) {
					possible[ modif + special ] = true;

				} else {
					possible[ modif + character ] = true;
					possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

					// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
					if ( modif === "shift+" ) {
						possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
					}
				}

				for ( var i = 0, l = keys.length; i < l; i++ ) {
					if ( possible[ keys[i] ] ) {
						return origHandler.apply( this, arguments );
					}
				}
			};
		}

		jQuery.each([ "keydown", "keyup", "keypress" ], function() {
			jQuery.event.special[ this ] = { add: keyHandler };
		});

	})( jQuery );


/***/ }
/******/ ]);