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

  it("changes direction when bounches off wall", function() {
    serverBall.bounceWall();
    expect(serverBall.ySpeed).toEqual(-2);
  });

  it("returns the balls coordinates", function() {
    expect(serverBall.getCoordinates()).toEqual({x: 300, y: 20});
  });


});
