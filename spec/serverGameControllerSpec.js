var GameController = require('../src/serverGameController.js');
var Ball = require('../src/serverBall.js');
var Paddle = require('../src/serverPaddle.js');
var Player = require('../src/serverPlayer.js');

describe("GameController", function(){
  var player;
  var paddle;
  var ball;
  var gameController;
  var gameLoopTickCallback;

  beforeEach(function(){
    ball = new Ball();
    paddle1 = new Paddle(15, 150);
    paddle2 = new Paddle(570, 150);
    player1 = new Player(paddle1, 1);
    player2 = new Player(paddle2, 2);
    gameController = new GameController(ball, player1, player2, gameLoopTickCallback);
  });

  describe("game start", function() {

    beforeEach(function() {
      spyOn(gameController.player1, 'setPlayStatus');
      spyOn(gameController.player2, 'setPlayStatus');
    });

    it("resets player1 ready state to false", function() {
      gameController.resetPlayerReadyState();
      expect(gameController.player1.setPlayStatus).toHaveBeenCalledWith(false);
    });

    it("resets player2 ready state to false", function() {
      gameController.resetPlayerReadyState();
      expect(gameController.player2.setPlayStatus).toHaveBeenCalledWith(false);
    });
  });

  describe("ball moves", function() {
    it("when game updates", function(){
      gameController.update();
      expect(gameController.ball.x).toEqual(303);
      expect(gameController.ball.y).toEqual(22);
    });
  });

  describe("ball changes course", function() {
    it("when hits top of paddle 1", function() {
      gameController.ball.x = (player1.paddle.x + player1.paddle.width + ball.xSpeed);
      gameController.ball.y = (player1.paddle.y);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeGreaterThan(0);
    });
    it("when hits bottom of paddle 1", function() {
      gameController.ball.x = (player1.paddle.x + player1.paddle.width + ball.xSpeed);
      gameController.ball.y = ((player1.paddle.y + player1.paddle.height) - ball.ySpeed);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeGreaterThan(0);
    });
    it("when hits top of paddle 2", function() {
      gameController.ball.x = (player2.paddle.x - ball.xSpeed);
      gameController.ball.y = (player2.paddle.y);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeLessThan(0);
    });
    it("when hits bottom of paddle 2", function() {
      gameController.ball.x = (player2.paddle.x - ball.xSpeed);
      gameController.ball.y = ((player2.paddle.y + player2.paddle.height) - ball.ySpeed);
      gameController.update();
      expect(gameController.ball.xSpeed).toBeLessThan(0);
    });
    it("when hits top wall", function() {
      gameController.ball.x = (gameController.gameBox/2);
      gameController.ball.y = (gameController.gameBox.y + ball.ySpeed);
      gameController.update();
      expect(gameController.ball.ySpeed).toBeGreaterThan(0);
    });
    it("when hits bottom wall", function() {
      gameController.ball.x = (gameController.gameBox/2);
      gameController.ball.y = (gameController.gameBox.height - ball.ySpeed);
      gameController.update();
      expect(gameController.ball.ySpeed).toBeLessThan(0);
    });
  });

  describe("ball goes out of play", function() {
    describe("when misses player1 paddle", function() {
      beforeEach(function() {
        gameController.ball.x = (gameController.gameBox.x - gameController.ball.xSpeed);
        gameController.ball.y = (gameController.gameBox.y - gameController.ball.ySpeed);
      });
      it("ball resets", function() {
        gameController.update();
        expect(gameController.ball.x).toEqual(300);
        expect(gameController.ball.y).toEqual(20);
      });
      it("increments player2's score", function() {
        gameController.update();
        expect(player2.score).toEqual(1);
      });
    });
    describe("when misses player2 paddle", function() {
      beforeEach(function() {
        gameController.ball.x = (gameController.gameBox.width - gameController.ball.xSpeed);
        gameController.ball.y = (gameController.gameBox.y - gameController.ball.ySpeed);
      });
      it("ball resets", function() {
        gameController.update();
        expect(gameController.ball.x).toEqual(300);
        expect(gameController.ball.y).toEqual(20);
      });
      it("increments player1's score", function() {
        gameController.update();
        expect(player1.score).toEqual(1);
      });
    });
    it("shows player's scores", function() {
      expect(gameController.getPlayerScores()).toEqual({player1:{id: 1, score: 0}, player2:{id: 2, score:0}});
    });
  });
});
