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

	var eventListeners = __webpack_require__(1);
	var Pong = __webpack_require__(2);
	var SocketEmitter = __webpack_require__(12);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	function ClientSocketEventListener(pong, socket) {
	  this.localPong = pong;
	  this.socket = socket
	}

	ClientSocketEventListener.prototype.setEventHandlers = function() {
	  var eventListener = this;
	  this.socket.on('connect', function() {
	    eventListener.onSocketConnected();
	  });
	  this.socket.on('start game', function(gameData) {
	    eventListener.localPong.createPlayers(gameData);
	    console.log(gameData);
	  });
	  this.socket.on('server moves ball', function(data) {
	    eventListener.localPong.setBallCoordinates(data);
	  });
	  this.socket.on('server moves player', function(data) {
	    eventListener.localPong.onServerMovePlayer(data);
	  });
	  this.socket.on('server updates scores', function(data) {
	    eventListener.localPong.onServerUpdatesScores(data);
	  });
	  this.socket.on('game won', function(data) {
	    eventListener.localPong.declareWinner(data);
	  });
	  this.socket.on('disconnect', function() {
	    eventListener.onSocketDisconnect();
	  });
	  this.socket.on('remove player', function(data) {
	    eventListener.localPong.removePlayer(data);
	  });
	  this.socket.on('paddle sound', function(data) {
	    eventListener.localPong.onPaddleSmack(data);
	  });
	  this.socket.on('wall sound', function(data) {
	    eventListener.localPong.onWallSmack(data);
	  });
	  this.socket.on('out sound', function(data) {
	    eventListener.localPong.onOutOfBounds(data);
	  });

	};

	ClientSocketEventListener.prototype.onSocketConnected = function() {
	  console.log("Connected to socket server");
	}

	ClientSocketEventListener.prototype.onSocketDisconnect = function() {
	  console.log("Disconnected from socket server");
	}

	module.exports = ClientSocketEventListener;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var GameController = __webpack_require__(3);
	var GameBox = __webpack_require__(4);
	var Ball = __webpack_require__(5);
	var Player = __webpack_require__(6);
	var Paddle = __webpack_require__(7);
	var keydown = __webpack_require__(8);
	var animate = __webpack_require__(9);
	var eventListeners = __webpack_require__(1);
	var Pong = __webpack_require__(2);
	__webpack_require__(10);
	var View = __webpack_require__(11);
	var SocketEmitter = __webpack_require__(12);

	var view = new View();

	var Pong = function(socket){
	  this.socket = socket
	  this.localPlayer;
	  this.opponent;
	  this.localBall;
	  this.gameController;
	  this.gameEnded = false;
	  this.lastPaddleMove = 0;
	  this.audio = new Audio("sounds/march.mp3");
	  this.outSound = new Audio("sounds/OutPong.wav");
	  this.wallSound = new Audio("sounds/plop.ogg");
	  this.paddleSound = new Audio("sounds/plop.ogg");
	  this.gameOverSound = new Audio("sounds/game-over.wav");
	  this.view = view
	  var self = this
	  this.view.signInForm.onsubmit = function(event, socket){
	    event.preventDefault();
	    self.view.afterSignInFormView();
	    self.socket.emit('player sign in', {playerName: self.view.newPlayerName.value});
	  }
	  this.view.playAgain.onclick = function() {
	    self.socket.emit("play again");
	    self.view.afterPlayAgain();
	  }
	}

	Pong.prototype.init = function(){// var view = new View();
	  this.context = this.view.canvas.getContext('2d');
	  this.context.font = '40px';
	  this.gameBox = new GameBox(this.context);
	  this.audio.play();
	};

	Pong.prototype.createPlayers = function(gameData){
	  for(var i = 0; i < gameData.players.length; i++) {
	    this.player = gameData.players[i];
	    this.paddle = new Paddle(this.player.x, this.player.y, this.context);
	    if (this.player.id === this.myId()) {
	      this.localPlayer = new Player(this.paddle, this.context, this.player.name);
	      this.localPlayer.id = this.myId();
	    } else {
	      this.opponent = new Player(this.paddle, this.context, this.player.name);
	      this.opponent.id = this.player.id;
	      this.view.startGameView();
	      this.localBall = new Ball(this.context);
	      this.localBall.setCoordinates(gameData.ballCoordinates);
	      this.gameController = new GameController(this.localBall, this.gameBox, this.localPlayer, this.opponent);
	      this.gameController.resetGame();
	      this.countdown();
	      this.draw();
	    }
	  }
	}
	//
	// Pong.prototype.createGame = function(gameData){
	//   this.view.startGameView();
	//   this.localBall = new Ball(this.context);
	//   this.localBall.setCoordinates(gameData.ballCoordinates);
	//   this.gameController = new GameController(this.localBall, this.gameBox, this.localPlayer, this.opponent);
	//   this.gameController.resetGame();
	//   this.countdown();
	//   this.draw();
	// }

	Pong.prototype.setBallCoordinates = function(data) {
	  this.localBall.setCoordinates(data);
	}

	Pong.prototype.onServerMovesBall = function(data) {
	  this.localBall.setCoordinates(data);
	}

	Pong.prototype.onServerMovePlayer = function(data) {
	  if (data.id === opponent.id) {
	    this.opponent.paddle.setY(data.y);
	  }
	}

	Pong.prototype.onServerUpdatesScores = function(data) {
	  this.gameController.setScores(data);
	}

	Pong.prototype.declareWinner = function(data){
	  if(this.gameController) {
	    this.gameController.endGame();
	    this.view.declareWinnerView(data.winner.name);
	    this.gameOverSound.play()
	  }
	}

	Pong.prototype.removePlayer = function(){
	  if(this.gameController) {
	    this.gameController.endGame();
	    this.view.removePlayerView();
	    this.gameOverSound.play()
	  }
	}

	 Pong.prototype.onPaddleSmack = function(){
	  this.paddleSound.play();
	}

	Pong.prototype.onWallSmack = function(){
	  this.wallSound.play();
	}

	Pong.prototype.onOutOfBounds = function(){
	  this.outSound.play();
	}

	Pong.prototype.myId = function() {
	  return this.socket.io.engine.id;
	}

	Pong.prototype.countdown = function() {
	  this.view.setGameStatusToCountdown();
	  setTimeout(function() {
	    this.audio.pause();
	    this.view.setGameStatusToPlay();
	    this.animate(gameLoop);
	    return;
	  }, 6000);
	}

	Pong.prototype.gameLoop = function(){
	  this.checkForPaddleMove();
	  this.draw();
	  if (gameController.isGameEnded === false) {
	    this.animate(gameLoop);
	  }
	}

	Pong.prototype.draw = function(){
	  this.gameController.drawGame();
	}

	Pong.prototype.checkForPaddleMove = function(){
	  this.timeNow = new Date();
	  this.timeSinceLastMove = timeNow - lastPaddleMove;
	  if (this.timeSinceLastMove < 15) {
	    return;
	  }
	  this.paddleMoved = false;
	  if (keydown.down) {
	    localPlayer.paddle.moveDown();
	    this.paddleMoved = true;
	  } else if (keydown.up) {
	    this.localPlayer.paddle.moveUp();
	    this.paddleMoved = true;
	  }
	  if (this.paddleMoved) {
	    this.socket.emit("client moves player", {y: localPlayer.paddle.getY()});
	    this.lastPaddleMove = timeNow;
	  }
	}


	module.exports = Pong


/***/ },
/* 3 */
/***/ function(module, exports) {

	var GameController = function(ball, gamebox, localPlayer, opponent){
	  this.ball = ball;
	  this.gameBox = gamebox;
	  this.localPlayer = localPlayer;
	  this.opponent = opponent;
	  this.isGameEnded = false
	  this.playing = false
	};

	  GameController.prototype.drawGame = function(){
	    this.gameBox.draw();
	    this.ball.draw();
	    this.localPlayer.draw();
	    this.opponent.draw();
	  };

	  GameController.prototype.setScores = function(scores) {
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

	  GameController.prototype.endGame = function(){
	    this.isGameEnded = true
	  }

	  GameController.prototype.resetGame = function(){
	    this.isGameEnded = false
	  }

	  module.exports = GameController;


/***/ },
/* 4 */
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
	  this.context.beginPath();
	  this.context.setLineDash([5, 3]);
	  this.context.lineWidth = 4;
	  this.context.strokeStyle = '#FFFFFF';
	  this.context.moveTo(300,0);
	  this.context.lineTo(300,400);
	  this.context.stroke();
	};

	module.exports = GameBox;


/***/ },
/* 5 */
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
/* 6 */
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
	  this.context.font = '15px PongFont';
	  this.context.fillText(this.name, this.paddle.x -10, 15);
	  this.context.fillText(this.score, this.paddle.x, 30);
	};

	Player.prototype.setName = function(name){
	  this.name = name;
	};

	Player.prototype.setScore = function(score){
	  this.score = score;
	};

	module.exports = Player;


/***/ },
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ function(module, exports) {

	var animate = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function (callback) {window.setTimeout(callback, 10000 / 60)};

	module.exports = animate;


/***/ },
/* 10 */
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


/***/ },
/* 11 */
/***/ function(module, exports) {

	function View() {
	  this.pong = document.getElementById('pong');
	  this.signInForm = document.getElementById('signIn');
	  this.newPlayerName = document.getElementById('playerName');
	  this.waiting = document.getElementById('waiting');
	  this.disconnect = document.getElementById('disconnect');
	  this.winner = document.getElementById('winner');
	  this.playAgain = document.getElementById('playAgain');
	  this.canvas = document.getElementById("canvas");
	  this.gameStatus = document.getElementById('gameStatus');
	}

	View.prototype.startGameView = function() {
	  this._showCanvas();
	  this._hideHeading();
	  this._hideWaiting();
	  this._hideDisconnect();
	  this._hideWinner();
	  this._wipeWinner();
	}

	View.prototype.declareWinnerView = function(winner) {
	  this.winner.innerHTML = winner + " wins"
	  this._showWinner();
	  this._showPlayAgain();
	  this._setGameStatusToOver();
	}

	View.prototype.removePlayerView = function() {
	  this._showDisconnect();
	  this._hideWinner();
	  this._showPlayAgain();
	  this._setGameStatusToOver();
	  this._hideGameStatus();
	}

	View.prototype.afterSignInFormView = function(){
	  this._showWaiting();
	  this._hideSignInForm();
	}

	View.prototype.afterPlayAgain = function(){
	  this._hideDisconnect();
	  this._showWaiting();
	  this._hideWinner();
	  this._hidePlayAgain();
	  this._hideCanvas();
	}

	View.prototype._setGameStatusToOver = function(){
	 this.gameStatus.innerHTML = "Game Over";
	 }

	View.prototype.setGameStatusToCountdown = function(){
	  for(var i = 5; i > 0; i--){
	    this._setDelay(i);
	  }
	}
	  View.prototype._setDelay = function(i) {
	    self = this;
	    setTimeout(function() {
	      self.gameStatus.innerHTML=i;
	    },(5000-((i-1)*1000)));
	  }

	View.prototype.setGameStatusToPlay = function() {
	  this.gameStatus.innerHTML = "Play";
	}

	View.prototype._showHeading = function() {
	  this.pong.style.display = 'inline';
	}

	View.prototype._hideHeading = function() {
	  this.pong.style.display = 'none';
	}

	View.prototype._showSignInForm = function() {
	  this.signInForm.style.display = 'inline';
	}

	View.prototype._hideSignInForm = function() {
	  this.signInForm.style.display = 'none';
	}

	View.prototype._showWaiting = function() {
	  this.waiting.style.display = 'inline';
	}

	View.prototype._hideWaiting = function() {
	  this.waiting.style.display = 'none';
	}

	View.prototype._showDisconnect = function() {
	  this.disconnect.style.display = 'inline';
	}

	View.prototype._hideDisconnect = function() {
	  this.disconnect.style.display = 'none';
	}

	View.prototype._showWinner = function() {
	  this.winner.style.display = 'inline';
	}

	View.prototype._hideWinner = function() {
	  this.winner.style.display = 'none';
	}

	View.prototype._wipeWinner = function() {
	  this.winner.innerHTML = "";
	}

	View.prototype._showPlayAgain = function() {
	  this.playAgain.style.display = 'inline';
	}

	View.prototype._hidePlayAgain = function() {
	  this.playAgain.style.display = 'none';
	}

	View.prototype._hideCanvas = function() {
	  this.canvas.style.display = 'none';
	}

	View.prototype._showCanvas = function() {
	  this.canvas.style.display = 'inline';
	}

	View.prototype._hideGameStatus = function() {
	  this.gameStatus.style.visibility = 'hidden';
	}


	module.exports = View;


/***/ },
/* 12 */
/***/ function(module, exports) {

	function SocketEventEmitter(socket) {
	  this.socket = socket;
	}

	SocketEventEmitter.prototype.signIn = function(value) {
	  this.socket.emit('player sign in', {playerName: value});
	};

	module.exports = SocketEventEmitter


/***/ }
/******/ ]);