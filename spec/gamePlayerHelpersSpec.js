var Player = require("../src/server/game/serverPlayer.js");
var gamePlayerHelper = require('../src/server/game/gamePlayerHelpers.js');

var getWinner = gamePlayerHelper.getWinner;
var getPlayerScores = gamePlayerHelper.getPlayerScores;
var getOpponent = gamePlayerHelper.getOpponent;
var getPlayerById = gamePlayerHelper.getPlayerById;


describe("gamePlayerHelper", function() {
  var paddle;
  var player1 = new Player(paddle, 1);
  var player2 = new Player(paddle, 2);


  describe("getWinner", function(){
    it("returns player1 when player1 wins", function() {
      player1.score = 10;
      expect(getWinner(player1, player2)).toEqual(player1);
    });
    it("returns player2 when player2 wins", function() {
      player1.score = 0;
      player2.score = 10;
      expect(getWinner(player1, player2)).toEqual(player2);
    });
  });

  describe("getPlayerScores", function() {
    it("returns player scores", function() {
      expect(getPlayerScores(player1, player2)).toEqual({player1:{id: 1, score: 0}, player2:{id: 2, score:10}});
    });
  });

  describe("getOpponent", function() {
    it("returns player1 when given player2 id", function() {
      expect(getOpponent(2, player1, player2)).toEqual(player1);
    });
    it("returns player2 when given player1 id", function() {
      expect(getOpponent(1, player1, player2)).toEqual(player2);
    });
    it("returns false when given invalid id", function() {
      expect(getOpponent(3, player1, player2)).toEqual(false);
    });
  });

  describe("getPlayerById", function() {
    it("returns player1 when given player1 id", function() {
      expect(getPlayerById(1, player1, player2)).toEqual(player1);
    });
    it("returns player2 when given player2 id", function() {
      expect(getPlayerById(2, player1, player2)).toEqual(player2);
    });
    it("returns false when given invalid id", function() {
      expect(getPlayerById(3, player1, player2)).toEqual(false);
    });
  });
});
