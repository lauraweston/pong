const Paddle = require('../public/js/paddle');
var canvas;
var paddle;

describe("Paddle", function() {
  beforeEach(function () {
    paddle = new Paddle(canvas, 550, 150);
  });

  it("is constructed with an x property", function () {
    expect(paddle.x).toEqual(550);
  });

  it("is constructed with a y property", function () {
    expect(paddle.y).toEqual(150);
  });

  it("moves down", function() {
    paddle.update(5);
    expect(paddle.y).toEqual(155);
  });

  it("moves up on", function() {
    paddle.update(-5);
    expect(paddle.y).toEqual(145);
  });
});
