var ball = require('../public/js/ball.js')
describe("Ball", function(){

  beforeEach(function(){
     gameBall = new ball
   });

   it("has a x, y coordinates", function(){
     expect(gameBall.x).toEqual(300)
     expect(gameBall.y).toEqual(200)
     });

   it("has a x, y coordinates velocity speed", function(){
     expect(gameBall.xSpeed).toEqual(-3)
     expect(gameBall.ySpeed).toEqual(0)
     });

   it("has a x, y coordinates that change on update by 3px", function(){
     gameBall.update()
     expect(gameBall.x).toEqual(297)
     expect(gameBall.y).toEqual(200)
     });

     describe("changes course when hits wall", function(){

       beforeEach(function(){
         for(var i = 0; i < 101;  i++) {
         gameBall.update()}
       })

         it("changed x and y coordinates when it hits left side", function(){
         expect(gameBall.x).toEqual(3)
         expect(gameBall.y).toEqual(200)
         });

         it("changed x and y speed when it hits left side", function(){
         expect(gameBall.xSpeed).toEqual(3)
         expect(gameBall.ySpeed).toEqual(0)
       })
     })

     describe("resets if ball passes through paddle side", function(){

       beforeEach(function(){
         for(var i = 0; i < 900;  i++) {
         gameBall.update()}
       })

     it("resets x and y coordinates when paddle fails(at the moment always)", function(){
       expect(gameBall.x).toEqual(300)
       expect(gameBall.y).toEqual(200)
       });

     it("resets x and y coordinates when paddle fails(at the moment always)", function(){
       expect(gameBall.xSpeed).toEqual(-3)
       expect(gameBall.ySpeed).toEqual(0)
     })
   })
});
