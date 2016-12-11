var Player = require('../src/remotePlayer.js').Player;

describe('remotePlayer', function() {
  var paddle;
  var player;

  beforeEach(function() {
    player = new Player(paddle);
  });

  it("sets the score", function() {
    player.setScore(1);
    expect(player.score).toEqual(1);
  });

  it("gets the score", function() {
    expect(player.getScore()).toEqual(0);
  });

  it("sets the name", function() {
    player.setName("Bob");
    expect(player.name).toEqual("Bob");
  });

  it("gets the score", function() {
    player.setName("Bob");
    expect(player.getName()).toEqual("Bob");
  });

});
