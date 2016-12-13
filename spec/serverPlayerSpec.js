var Player = require('../src/serverPlayer.js');

describe('serverPlayer', function() {
  var paddle;
  var player;

  beforeEach(function() {
    player = new Player(paddle);
  });


  it("sets the name", function() {
    player.setName("Bob");
    expect(player.name).toEqual("Bob");
  });

  it("gets the name", function() {
    player.setName("Bob");
    expect(player.getName()).toEqual("Bob");
  });

  it("increases the score", function() {
    player.increaseScore();
    expect(player.score).toEqual(1);
  });

  it("gets the score", function() {
    expect(player.getScore()).toEqual(0);
  });

  it("resets the player", function() {
    player.increaseScore();
    player.reset();
    expect(player.score).toEqual(0);
    expect(player.isReady).toEqual(true);
  });

  it("resets the score", function() {
    player.increaseScore();
    player.resetScore();
    expect(player.score).toEqual(0);
  });

  it("sets isReady to true when player has clicked Play again", function() {
    player.setPlayStatus(true);
    expect(player.isReady).toEqual(true);
  });
});
