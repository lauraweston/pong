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

	var View = __webpack_require__(1);
	var GameController = __webpack_require__(2);
	var GameBox = __webpack_require__(3);
	var Ball = __webpack_require__(4);
	var Player = __webpack_require__(5);
	var Paddle = __webpack_require__(6);
	var keydown = __webpack_require__(7);
	var animate = __webpack_require__(8);
	__webpack_require__(9);
	var socket;
	var localPlayer;
	var opponent;
	var localBall;
	var context;
	var gameBox;
	var gameController;
	var gameEnded = false;
	var lastPaddleMove = 0;
	var audio = new Audio("sounds/pongSound.mp3");
	var paddleSound = new Audio("sounds/PaddlePong.wav")
	var wallSound = new Audio("sounds/wallBounce.wav")
	var view;

	(function init(){
	  view = new View();
	  context = view.canvas.getContext('2d');
	  gameBox = new GameBox(context);
	  socket = io.connect(getUrl());
	  audio.play();
	  setEventHandlers();
	})();

	function setEventHandlers() {
	  socket.on("connect", onSocketConnected);
	  socket.on("start game", startGame);
	  socket.on("server moves ball", onServerMovesBall);
	  socket.on("server moves player", onServerMovePlayer);
	  socket.on("server updates scores", onServerUpdatesScores);
	  socket.on("game won", declareWinner);
	  socket.on("disconnect", onSocketDisconnect);
	  socket.on("remove player", removePlayer);
	  socket.on("paddle sound", onPaddleSmack);
	  socket.on("wall sound", onWallSmack);

	}

	function onSocketConnected() {
	  console.log("Connected to socket server");
	}

	function startGame(gameData){
	  view.startGameView();
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
	  gameController.resetGame();
	  countdown();
	  draw();
	}


	function onServerMovesBall(data) {
	  localBall.setCoordinates(data);
	}

	function onServerMovePlayer(data) {
	  if (data.id === opponent.id) {
	    opponent.paddle.setY(data.y);
	  }
	}

	function onServerUpdatesScores(data) {
	  gameController.setScores(data);
	}

	function declareWinner(data){
	  if(gameController) {
	    gameController.endGame();
	  }
	  view.declareWinnerView(data.winner.name);
	}

	function onSocketDisconnect() {
	  console.log("Disconnected from socket server");
	}

	function removePlayer(){
	  if(gameController) {
	    gameController.endGame();
	  }
	  view.removePlayerView();
	}

	function onPaddleSmack(){
	  paddleSound.play();
	}

	function onWallSmack(){
	  wallSound.play();
	}

	function myId() {
	  return socket.io.engine.id;
	}

	function countdown() {
	  view.setGameStatusToCountdown();
	  setTimeout(function() {
	    audio.pause();
	    view.setGameStatusToPlay();
	    animate(gameLoop);
	    return;
	  }, 6000);
	}

	function gameLoop(){
	  checkForPaddleMove();
	  draw();
	  if (gameController.isGameEnded === false) {
	    animate(gameLoop);
	  }
	}

	function draw(){
	  gameController.drawGame();
	}

	function checkForPaddleMove(){
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
	}

	view.signInForm.onsubmit = function(event){
	  event.preventDefault();
	  view.afterSignInFormView();
	  socket.emit('player sign in', {playerName: view.newPlayerName.value});
	}

	view.playAgain.onclick = function() {
	  socket.emit("play again");
	  view.afterPlayAgain();
	}

	function getUrl() {
	  return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
	}


/***/ },
/* 1 */
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
	  this.gameStatus = document.getElementById('countdown');
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

	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var GameController = function(ball, gamebox, localPlayer, opponent){
	  this.ball = ball;
	  this.gameBox = gamebox;
	  this.localPlayer = localPlayer;
	  this.opponent = opponent;
	  this.isGameEnded = false
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
/* 3 */
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
/* 4 */
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
/* 5 */
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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ function(module, exports) {

	var animate = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function (callback) {window.setTimeout(callback, 10000 / 60)};

	module.exports = animate;


/***/ },
/* 9 */
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