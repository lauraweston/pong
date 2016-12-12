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

});
