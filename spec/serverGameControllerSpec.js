var GameController = require('../src/server/game/serverGameController.js');

describe("ServerGameController", function(){
  var gameController;
  var socketEventEmitter;
  var player1;
  var player2;
  var ball;

  beforeEach(function(){
    socketEventEmitter = jasmine.createSpyObj('socketEventEmitter', ['emitStartGameEvent', 'emitServerMoveBallEvent', 'emitServerUpdateScoreEvent', 'emitGameWonEvent', 'emitRemoveOpponentEventToPlayer', 'emitOpponentMoveEventToPlayer']);
    gameController = new GameController(socketEventEmitter);
    gameController.addNewPlayerToGame(1);
    gameController.addNewPlayerToGame(2);
    gameController.updatePlayerName({playerName: "John"}, 1);
    gameController.updatePlayerName({playerName: "Sally"}, 2);
    player1 = gameController.player1;
    player2 = gameController.player2;
    ball = gameController.ball;
  });

  describe("game start", function() {

    beforeEach(function() {
      spyOn(gameController.player1, 'setPlayerReady');
      spyOn(gameController.player2, 'setPlayerReady');
    });

    it("resets player1 ready state to false", function() {
      gameController.resetPlayerReadyState();
      expect(gameController.player1.setPlayerReady).toHaveBeenCalledWith(false);
    });

    it("resets player2 ready state to false", function() {
      gameController.resetPlayerReadyState();
      expect(gameController.player2.setPlayerReady).toHaveBeenCalledWith(false);
    });
  });

  // describe("ball changes course", function() {
  //   it("when hits top of paddle 1", function() {
  //     gameController.ball.x = (player1.paddle.x + player1.paddle.width + ball.xSpeed);
  //     gameController.ball.y = (player1.paddle.y);
  //     gameController.update();
  //     expect(gameController.ball.xSpeed).toBeGreaterThan(0);
  //   });
  //   it("when hits bottom of paddle 1", function() {
  //     gameController.ball.x = (player1.paddle.x + player1.paddle.width + ball.xSpeed);
  //     gameController.ball.y = ((player1.paddle.y + player1.paddle.height) - ball.ySpeed);
  //     gameController.update();
  //     expect(gameController.ball.xSpeed).toBeGreaterThan(0);
  //   });
  //   it("when hits top of paddle 2", function() {
  //     gameController.ball.x = (player2.paddle.x - ball.xSpeed);
  //     gameController.ball.y = (player2.paddle.y);
  //     gameController.update();
  //     expect(gameController.ball.xSpeed).toBeLessThan(0);
  //   });
  //   it("when hits bottom of paddle 2", function() {
  //     gameController.ball.x = (player2.paddle.x - ball.xSpeed);
  //     gameController.ball.y = ((player2.paddle.y + player2.paddle.height) - ball.ySpeed);
  //     gameController.update();
  //     expect(gameController.ball.xSpeed).toBeLessThan(0);
  //   });
  //   it("when hits top wall", function() {
  //     gameController.ball.x = (gameController.gameBox/2);
  //     gameController.ball.y = (gameController.gameBox.y + ball.ySpeed);
  //     gameController.update();
  //     expect(gameController.ball.ySpeed).toBeGreaterThan(0);
  //   });
  //   it("when hits bottom wall", function() {
  //     gameController.ball.x = (gameController.gameBox/2);
  //     gameController.ball.y = (gameController.gameBox.height - ball.ySpeed);
  //     gameController.update();
  //     expect(gameController.ball.ySpeed).toBeLessThan(0);
  //   });
  // });

  describe("ball goes out of play", function() {
    describe("when misses player1 paddle", function() {
      beforeEach(function() {
        gameController.ball.x = (gameController.gameBox.x - gameController.ball.xSpeed);
        gameController.ball.y = (gameController.gameBox.y - gameController.ball.ySpeed);
      });
      // it("ball resets", function() {
      //   gameController.update();
      //   expect(gameController.ball.x).toEqual(300);
      //   expect(gameController.ball.y).toEqual(20);
      // });
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
  });
});
