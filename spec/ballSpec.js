var Ball = require('../public/js/ball.js');
var ball;
var context;

describe("Ball", function(){
  beforeEach(function(){
    ball = new Ball(context);
    console.log(ball);
  });
  it("sets the coordinates", function() {
    ball.setCoordinates({x: 303, y: 22});
    console.log(ball.x);
    expect(ball.x).toEqual(303);
    expect(ball.y).toEqual(22);
  });


});
