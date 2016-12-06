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
    paddle.moveDown();
    expect(paddle.y).toEqual(155);
  });

  it("moves up", function() {
    paddle.moveUp();
    expect(paddle.y).toEqual(145);
  });

  it("does not move beyond upper end of canvas", function() {
    paddle = new Paddle(canvas, 550, 0);
    paddle.moveUp();
    expect(paddle.y).toEqual(0);
  });

  it("does not move beyond lower end of canvas", function() {
    paddle = new Paddle(canvas, 550, 330);
    paddle.moveDown();
    expect(paddle.y).toEqual(330);
  });

});
