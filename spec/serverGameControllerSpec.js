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
  //TODO: finish testing ServerGameController emit events
});
