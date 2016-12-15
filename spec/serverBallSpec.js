var ServerBall = require('../src/server/game/serverBall.js');

describe('serverBall', function() {
  var serverBall;


  beforeEach(function() {
    serverBall = new ServerBall();
  });

  it("changes direction when bounces off paddle", function() {
    serverBall.bouncePaddle();
    expect(serverBall.xSpeed).toEqual(-3.2);
  });

  it("changes direction when bounces off wall", function() {
    serverBall.bounceWall();
    expect(serverBall.ySpeed).toEqual(-2);
  });

  it("updates ball coordinates", function() {
    serverBall.update();
    expect(serverBall.x).toEqual(303);
    expect(serverBall.y).toEqual(22);
  });

  it("returns the balls coordinates", function() {
    expect(serverBall.getCoordinates()).toEqual({x: 300, y: 20});
  });

  it("resets the ball coordinates", function() {
    serverBall.update();
    serverBall.reset();
    expect(serverBall.x).toEqual(300);
    expect(serverBall.y).toEqual(20);
  });

  it("resets the ball speed", function() {
    serverBall.update();
    serverBall.reset();
    expect(serverBall.xSpeed).toEqual(3);
    expect(serverBall.ySpeed).toEqual(2);
  });

  describe("ball sound effects", function() {
    it("changes paddleSound to true when ball bounces off paddle", function() {
      serverBall.bouncePaddle();
      expect(serverBall.paddleSound).toEqual(true);
    });

    it("changes wallSound to true when ball bounces off wall", function() {
      serverBall.bounceWall();
      expect(serverBall.wallSound).toEqual(true);
    });

    it("changes outSound to true when ball is reset", function() {
      serverBall.reset();
      expect(serverBall.outSound).toEqual(true);
    });
    
    it("resets ball sound properties to false", function() {
      serverBall.bouncePaddle();
      serverBall.bounceWall();
      serverBall.resetSounds();
      expect(serverBall.paddleSound).toEqual(false);
      expect(serverBall.wallSound).toEqual(false);
      expect(serverBall.outSound).toEqual(false);
    });
  });
});
