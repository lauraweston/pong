var Ball = require('../public/js/ball.js');
var ball;
var context;

describe("Ball", function(){
  beforeEach(function(){
    ball = new Ball(context);
  });
  it("sets the coordinates", function() {
    ball.setCoordinates({x: 303, y: 22});
    expect(ball.x).toEqual(303);
    expect(ball.y).toEqual(22);
  });


});
