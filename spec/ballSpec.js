var Ball = require('../public/js/ball.js');
var Paddle = require('../public/js/paddle.js');
var Player = require('../public/js/player.js');

describe("Ball", function(){
  var player;
  var paddle;
  beforeEach(function(){
    gameBall = new Ball();
    paddle1 = new Paddle(570, 150);
    paddle2 = new Paddle(15, 150);
    player1 = new Player(paddle1);
    player2 = new Player(paddle2);
  });


});
