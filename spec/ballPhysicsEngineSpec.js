var ballPhysicsEngine = require('../src/server/game/ballPhysicsEngine.js');
var ballHitsWall = ballPhysicsEngine.ballHitsWall;
var Ball = require("../src/server/game/serverBall.js");

describe("ballPhysicsEngine", function() {
  var ball = new Ball();
  var gameBox = {
                  height: 400,
                  width:  600,
                  x:        0,
                  y:        0
  };

  describe("ballHitsWall", function(){
    beforeEach(function() {
      spyOn(ball, 'bounceWall');
    });

    it("calls bounceWall on ball when ball hits top wall", function() {
      ball.y = gameBox.y;
      ballHitsWall(ball, gameBox);
      expect(ball.bounceWall).toHaveBeenCalled();
    });
    it("calls bounceWall on ball when ball hits bottom wall", function() {
      ball.y = gameBox.height;
      ballHitsWall(ball, gameBox);
      expect(ball.bounceWall).toHaveBeenCalled();
    });
    it("does not call bounceWall on ball when ball does not hit a wall", function() {
      ball.y = 1;
      ballHitsWall(ball, gameBox);
      expect(ball.bounceWall).not.toHaveBeenCalled();
    });
  });

});
