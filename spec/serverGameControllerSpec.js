var GameController = require('../src/server/game/serverGameController.js');

describe("ServerGameController", function(){
  var gameController;
  var socketEventEmitter;
  var player1;
  var player2;
  var ball;
  var ballPhysicsEngine;
  var gameBox = {
                  height: 400,
                  width:  600,
                  x:        0,
                  y:        0
                };

  beforeEach(function(){
    socketEventEmitter = jasmine.createSpyObj('socketEventEmitter', [
      'emitStartGameEvent',
      'emitServerMoveBallEvent',
      'emitServerUpdateScoreEvent',
      'emitGameWonEvent',
      'emitRemoveOpponentEventToPlayer',
      'emitOpponentMoveEventToPlayer'
    ]);
    gameController = new GameController(socketEventEmitter);
  });

  describe("game setup", function() {
    it("adds the first player to the game", function() {
      gameController.addNewPlayerToGame(1);
      expect(gameController.player1.id).toEqual(1);
    });
    it("adds the second player to the game", function() {
      gameController.addNewPlayerToGame(1);
      gameController.addNewPlayerToGame(2);
      expect(gameController.player2.id).toEqual(2);
    });
    it("does not add more than two players to a game", function() {
      gameController.addNewPlayerToGame(1);
      gameController.addNewPlayerToGame(2);
      gameController.addNewPlayerToGame(3);
      expect(gameController.player1.id).toEqual(1);
      expect(gameController.player2.id).toEqual(2);
    });
    it("emits start game event when two players have joined and entered names", function() {
      gameController.addNewPlayerToGame(1);
      gameController.addNewPlayerToGame(2);
      gameController.updatePlayerName({playerName: "John"}, 1);
      gameController.updatePlayerName({playerName: "Sally"}, 2);
      var expectedGameData = {
        players: [
          {
            id: 1,
            name: "John",
            x: 15,
            y: 150
          },
          {
            id: 2,
            name: "Sally",
            x: 570,
            y: 150
          }
        ],
        ballCoordinates: {x: 300, y: 20}
      };
      expect(gameController.eventEmitter.emitStartGameEvent).toHaveBeenCalledWith(expectedGameData);
    });
  });

  describe("game in progress", function() {
    beforeEach(function() {
      gameController.addNewPlayerToGame(1);
      gameController.addNewPlayerToGame(2);
      gameController.updatePlayerName({playerName: "John"}, 1);
      gameController.updatePlayerName({playerName: "Sally"}, 2);
      player1 = gameController.player1;
      player2 = gameController.player2;
      ball = gameController.ball;
      ballPhysicsEngine = gameController.ballPhysicsEngine;

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

    describe("update", function() {
      beforeEach(function() {
        spyOn(gameController.ball, 'update');
        spyOn(gameController.ball, 'resetSounds');
        spyOn(gameController.ballPhysicsEngine, 'ballHitsWall');
        spyOn(gameController.ballPhysicsEngine, 'ballHitsPaddle');
        spyOn(gameController.ballPhysicsEngine, 'ballGoesOutOfPlay');
        gameController.update();
      });

      it("calls update on ball", function() {
        expect(ball.update).toHaveBeenCalled();
      });
      it("calls resetSounds on ball", function() {
        expect(ball.resetSounds).toHaveBeenCalled();
      });
      it("calls ballHitsWall on ballPhysicsEngine", function() {
        expect(ballPhysicsEngine.ballHitsWall).toHaveBeenCalledWith(ball, gameBox);
      });
      it("calls ballHitsPaddle on ballPhysicsEngine", function() {
        expect(ballPhysicsEngine.ballHitsPaddle).toHaveBeenCalledWith(ball, player1, player2);
      });
      it("calls ballGoesOutOfPlay on ballPhysicsEngine", function() {
        expect(ballPhysicsEngine.ballGoesOutOfPlay).toHaveBeenCalledWith(ball, gameBox, player1, player2);
      });
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

  // describe("ball goes out of play", function() {
  //   describe("when misses player1 paddle", function() {
  //     beforeEach(function() {
  //       gameController.ball.x = (gameController.gameBox.x - gameController.ball.xSpeed);
  //       gameController.ball.y = (gameController.gameBox.y - gameController.ball.ySpeed);
  //     });
      // it("ball resets", function() {
      //   gameController.update();
      //   expect(gameController.ball.x).toEqual(300);
      //   expect(gameController.ball.y).toEqual(20);
      // });
    //   it("increments player2's score", function() {
    //     gameController.update();
    //     expect(player2.score).toEqual(1);
    //   });
    // });
    //
    // describe("when misses player2 paddle", function() {
    //   beforeEach(function() {
    //     gameController.ball.x = (gameController.gameBox.width - gameController.ball.xSpeed);
    //     gameController.ball.y = (gameController.gameBox.y - gameController.ball.ySpeed);
    //   });
    //   it("ball resets", function() {
    //     gameController.update();
    //     expect(gameController.ball.x).toEqual(300);
    //     expect(gameController.ball.y).toEqual(20);
    //   });
    //   it("increments player1's score", function() {
    //     gameController.update();
    //     expect(player1.score).toEqual(1);
    //   });
    // });
  // });
});
