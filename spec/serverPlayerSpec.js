var Player = require('../src/server/game/serverPlayer.js');
var Paddle = require('../src/server/game/serverPaddle.js');

describe('serverPlayer', function() {
  var paddle;
  var player;

  beforeEach(function() {
    paddle = new Paddle(570, 150);
    player = new Player(paddle);
  });

  it("gets the name of the player", function() {
    player.setName("Bob");
    expect(player.getName()).toEqual("Bob");
  });

  it("sets the name of the player", function() {
    player.setName("Bob");
    expect(player.name).toEqual("Bob");
  });

  it("checks if a name has been assigned and return false if not", function() {
    expect(player.isAssignedName()).toEqual(false);
  });

  it("checks if a name has been assigned and return true if it has", function() {
    player.setName("Bob");
    expect(player.isAssignedName()).toEqual(true);
  });

  it("increases the score by 1", function() {
    player.increaseScore();
    expect(player.score).toEqual(1);
  });

  it("gets the current score", function() {
    player.increaseScore();
    expect(player.getScore()).toEqual(1);
  });

  it("resets the player", function() {
    spyOn(player.paddle, 'reset');
    player.increaseScore();
    player.reset();
    expect(player.score).toEqual(0);
    expect(player.isReady).toEqual(true);
    expect(player.paddle.reset).toHaveBeenCalled();
  });

  it("resets the score", function() {
    player.increaseScore();
    player.resetScore();
    expect(player.score).toEqual(0);
  });

  it("sets isReady to true when setPlayerReady is called with true", function() {
    player.setPlayerReady(true);
    expect(player.isReady).toEqual(true);
  });

  it("sets isReady to false when setPlayerReady is called with false", function() {
    player.setPlayerReady(false);
    expect(player.isReady).toEqual(false);
  });
});
