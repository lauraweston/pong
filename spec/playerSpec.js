var Player = require('../public/js/player.js');
var Paddle = require('../public/js/paddle.js');

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
});
