var Ball = require('../public/js/ball.js');
var Paddle = require('../public/js/paddle.js');

describe("Ball", function(){
  var canvas;
  var paddle;
  beforeEach(function(){
    gameBall = new Ball();
    paddle = new Paddle(canvas, 570, 150);
  });

  it("has a x, y coordinates", function(){
    expect(gameBall.x).toEqual(300);
    expect(gameBall.y).toEqual(200);
  });

  it("has a x, y coordinates velocity speed", function(){
    expect(gameBall.xSpeed).toEqual(-3);
    expect(gameBall.ySpeed).toEqual(0);
  });

  it("has a x, y coordinates that change on update by 3px", function(){
    gameBall.update(paddle);
    expect(gameBall.x).toEqual(297);
    expect(gameBall.y).toEqual(200);
  });

  describe("changes course when hits wall", function(){

    beforeEach(function(){
      for(var i = 0; i < 101;  i++) {
        gameBall.update(paddle);
      }
    });

    it("changed x and y coordinates when it hits left side", function(){
      expect(gameBall.x).toEqual(3);
      expect(gameBall.y).toEqual(200);
    });

    it("changed x and y speed when it hits left side", function(){
      expect(gameBall.xSpeed).toEqual(3);
      expect(gameBall.ySpeed).toEqual(0);
    });
  });

  describe("changes course when hits paddle", function() {
    it("changes x and y coordinates when it hits the paddle", function() {

      for(var i = 0; i < 290;  i++) {
        gameBall.update(paddle);
      }
      expect(gameBall.xSpeed).toEqual(-3);
      expect(gameBall.ySpeed).toEqual(0);
    });
  });

  describe("resets if ball passes through paddle side", function(){
    var paddle2 = new Paddle(canvas, 0, 0);
    
    beforeEach(function(){
      for(var i = 0; i < 900;  i++) {
        gameBall.update(paddle2);
      }
    });

    it("resets x and y coordinates when paddle fails(at the moment always)", function(){

      expect(gameBall.x).toEqual(300);
      expect(gameBall.y).toEqual(200);
    });

    it("resets x and y coordinates when paddle fails(at the moment always)", function(){
      expect(gameBall.xSpeed).toEqual(-3);
      expect(gameBall.ySpeed).toEqual(0);
    });
  });
});
