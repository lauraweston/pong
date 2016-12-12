var GameController = require('../src/serverGameController.js');
var Ball = require('../src/serverBall.js');
var Paddle = require('../src/remotePaddle.js');
var Player = require('../src/remotePlayer.js').Player;

describe("GameController", function(){
  var player;
  var paddle;
  var ball;
  var gameController;
  var gameLoopTickCallback;

  beforeEach(function(){
    ball = new Ball();
    paddle1 = new Paddle(570, 150);
    paddle2 = new Paddle(15, 150);
    player1 = new Player(paddle1);
    player2 = new Player(paddle2);
    gameController = new GameController(ball, player1, player2, gameLoopTickCallback);
  });

  describe("ball changes course", function() {
    it("when hits top of paddle 1", function() {
      gameController.ball.x = (player1.paddle.x - ball.xSpeed);
      gameController.ball.y = (player1.paddle.y);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeLessThan(0);
    });
    it("when hits bottom of paddle 1", function() {
      gameController.ball.x = (player1.paddle.x - ball.xSpeed);
      gameController.ball.y = ((player1.paddle.y + player1.paddle.height) - ball.ySpeed);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeLessThan(0);
    });
    it("when hits top of paddle 2", function() {
      gameController.ball.x = (player2.paddle.x + player2.paddle.width + ball.xSpeed);
      gameController.ball.y = (player2.paddle.y);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeGreaterThan(0);
    });
    it("when hits bottom of paddle 2", function() {
      gameController.ball.x = (player2.paddle.x + player2.paddle.width + ball.xSpeed);
      gameController.ball.y = ((player2.paddle.y + player2.paddle.height) - ball.ySpeed);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeGreaterThan(0);
    });
  });
});
