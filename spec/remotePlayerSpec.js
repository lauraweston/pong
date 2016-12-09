var remotePlayer = require('../src/remotePlayer.js');
var Player = remotePlayer.Player;
var Paddle = remotePlayer.Paddle;

describe('remotePlayer', function() {
  var paddle;
  var player;

  beforeEach(function() {
    paddle = new Paddle(570, 150);
    player = new Player(paddle);
  });

  it("sets the score", function() {
    player.setScore(1);
    expect(player.score).toEqual(1);
  });

  it("gets the score", function() {
    expect(player.getScore()).toEqual(0);
  });

  it("sets y coordinates of paddle", function() {
    paddle.setY(155);
    expect(paddle.y).toEqual(155);
  });

  it("gets y coordinates of paddle", function() {
    expect(paddle.getY()).toEqual(150);
  });
});
