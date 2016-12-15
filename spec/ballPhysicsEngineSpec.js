var Ball = require("../src/server/game/serverBall.js");
var Player = require("../src/server/game/serverPlayer.js");
var Paddle = require("../src/server/game/serverPaddle.js");
var ballPhysicsEngine = require('../src/server/game/ballPhysicsEngine.js');
var ballHitsWall = ballPhysicsEngine.ballHitsWall;
var ballHitsPaddle = ballPhysicsEngine.ballHitsPaddle;
var ballGoesOutOfPlay = ballPhysicsEngine.ballGoesOutOfPlay;

describe("ballPhysicsEngine", function() {
  var ball = new Ball();
  var gameBox = {
                  height: 400,
                  width:  600,
                  x:        0,
                  y:        0
  };
  var paddle1 = new Paddle(15, 150);
  var paddle2 = new Paddle(570, 150);
  var player1 = new Player(paddle1, 1);
  var player2 = new Player(paddle2, 2);

  describe("ballHitsWall", function(){
    beforeEach(function() {
      spyOn(ball, 'bounceWall');
    });

    it("calls bounceWall on ball when ball hits top wall", function() {
      ball.y = gameBox.y;
      ballHitsWall(ball, gameBox);
      expect(ball.bounceWall).toHaveBeenCalled();
    });
    it("calls bounceWall on ball when ball hits bottom wall", function() {
      ball.y = gameBox.height;
      ballHitsWall(ball, gameBox);
      expect(ball.bounceWall).toHaveBeenCalled();
    });
    it("does not call bounceWall on ball when ball does not hit a wall", function() {
      ball.y = 1;
      ballHitsWall(ball, gameBox);
      expect(ball.bounceWall).not.toHaveBeenCalled();
    });
  });

  describe("ballHitsPaddle", function() {
    beforeEach(function() {
      spyOn(ball, 'bouncePaddle');
    });

    it("calls bouncePaddle when ball hits player1 paddle", function() {
      ball.x = paddle1.x;
      ball.y = paddle1.y;
      ballHitsPaddle(ball, player1, player2);
      expect(ball.bouncePaddle).toHaveBeenCalled();
    });
    it("calls bouncePaddle when ball hits player2 paddle", function() {
      ball.x = paddle2.x;
      ball.y = paddle2.y;
      ballHitsPaddle(ball, player1, player2);
      expect(ball.bouncePaddle).toHaveBeenCalled();
    });
    it("does not call bouncePaddle when ball misses paddle", function() {
      ball.x = gameBox/2;
      ball.y = gameBox/2;
      ballHitsPaddle(ball, player1, player2);
      expect(ball.bouncePaddle).not.toHaveBeenCalled();
    });
  });

  describe("ballGoesOutOfPlay", function() {
    beforeEach(function() {
      spyOn(ball, 'reset');
      spyOn(player1, 'increaseScore');
      spyOn(player2, 'increaseScore');
    });

    it("calls increaseScore and resets ball when it goes out on the left", function() {
      ball.x = gameBox.width;
      ballGoesOutOfPlay(ball, gameBox, player1, player2);
      expect(player1.increaseScore).toHaveBeenCalled();
      expect(ball.reset).toHaveBeenCalled();
    });
    it("calls increaseScore and resets ball when it goes out on the right", function() {
      ball.x = gameBox.x;
      ballGoesOutOfPlay(ball, gameBox, player1, player2);
      expect(player2.increaseScore).toHaveBeenCalled();
      expect(ball.reset).toHaveBeenCalled();
    });
  });
});
