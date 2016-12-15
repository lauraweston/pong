var Paddle = require('../src/server/game/serverPaddle.js');

describe('serverPaddle', function() {
  var paddle;

  beforeEach(function() {
    paddle = new Paddle(570, 150);
  });

  it("sets y coordinates of paddle", function() {
    paddle.setY(155);
    expect(paddle.y).toEqual(155);
  });

  it("gets y coordinates of paddle", function() {
    expect(paddle.getY()).toEqual(150);
  });

  it("gets x coordinates of paddle", function() {
    expect(paddle.getX()).toEqual(570);
  });

  it("resets paddle y coordinates to starting y coordinate", function() {
    paddle.setY(0);
    paddle.reset();
    expect(paddle.y).toEqual(150);
  });
});
