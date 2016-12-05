const Paddle = require('../public/js/paddle');

describe("Paddle", function() {
    it("moves down on keypress down arrow", function() {
      const canvas;
      const paddle = new Paddle(canvas, 550, 150);
      paddle.update(1);
      expect(paddle.y).toEqual(151);
    });
});
