var ServerBall = require('../src/server/game/serverBall.js');

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

  it("updates ball coordinates", function() {
    serverBall.update();
    expect(serverBall.x).toEqual(303);
    expect(serverBall.y).toEqual(22);
  });

  it("resets the ball", function() {
    serverBall.update();
    serverBall.reset();
    expect(serverBall.x).toEqual(300);
    expect(serverBall.y).toEqual(20);
  });

  it("returns the balls coordinates", function() {
    expect(serverBall.getCoordinates()).toEqual({x: 300, y: 20});
  });


});
