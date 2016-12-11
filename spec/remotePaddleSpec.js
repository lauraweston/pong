var Paddle = require('../src/remotePaddle.js').Paddle;


describe('remotePaddle', function() {
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
});
