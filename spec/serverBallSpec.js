var ServerBall = require('../src/serverBall.js');

describe('serverBall', function() {
  var serverBall;


  beforeEach(function() {
    serverBall = new ServerBall();
  });

  it("changes direction when bounches off padde", function() {
    serverBall.bouncePaddle();
    expect(serverBall.xSpeed).toEqual(-3);
  });
  //
  // it("gets the score", function() {
  //   expect(player.getScore()).toEqual(0);
  // });
  //
  // it("sets y coordinates of paddle", function() {
  //   paddle.setY(155);
  //   expect(paddle.y).toEqual(155);
  // });
  //
  // it("gets y coordinates of paddle", function() {
  //   expect(paddle.getY()).toEqual(150);
  // });
});
