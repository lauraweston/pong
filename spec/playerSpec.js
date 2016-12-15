var Player = require('../src/client/player.js');
var Paddle = require('../src/client/paddle.js');

describe("Player", function() {
  var player;
  var paddle = new Paddle(15, 150);

  beforeEach(function() {
    player = new Player(paddle);
  });

  it("has an initial score of zero", function() {
    expect(player.score).toEqual(0);
  });

  it("has a paddle", function () {
    expect(player.paddle).toEqual(paddle);
  });

  it("sets a name", function() {
    player.setName("Bob")
    expect(player.name).toEqual("Bob");
  });

  it("sets the score", function() {
    player.setScore(1);
    expect(player.score).toEqual(1);
  });
});
