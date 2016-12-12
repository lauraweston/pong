// var Ball = require('../public/js/ball.js');
// var Paddle = require('../public/js/paddle.js');
// var Player = require('../public/js/player.js');
//
// describe("Ball", function(){
//   var player;
//   var paddle;
//   beforeEach(function(){
//     gameBall = new Ball();
//     paddle1 = new Paddle(570, 150);
//     paddle2 = new Paddle(15, 150);
//     player1 = new Player(paddle1);
//     player2 = new Player(paddle2);
//   });
//
//   it("has a x, y coordinates", function(){
//     expect(gameBall.x).toEqual(300);
//     expect(gameBall.y).toEqual(20);
//   });
//
//   it("has a x, y coordinates velocity speed", function(){
//     expect(gameBall.xSpeed).toEqual(3);
//     expect(gameBall.ySpeed).toEqual(2);
//   });
//
//   it("has a x, y coordinates that change on update by 3px", function(){
//     gameBall.update(player1, player2);
//     expect(gameBall.x).toEqual(303);
//     expect(gameBall.y).toEqual(22);
//   });
//
//   describe("changes course when hits wall", function(){
//
//     beforeEach(function(){
//       for(var i = 0; i < 210;  i++) {
//         gameBall.update(player1, player2);
//       }
//     });
//
//   it("changes course when it hits a wall", function(){
//     expect(gameBall.xSpeed).toEqual(-3);
//     expect(gameBall.ySpeed).toEqual(-2);
//   });
//
//   });
//
//   // describe("changes course when hits left paddle", function() {
//   //   it("changes x and y coordinates when it hits the paddle", function() {
//   //     for(var i = 0; i < 290;  i++) {
//   //       gameBall.update(player1, player2);
//   //     }
//   //     expect(gameBall.xSpeed).toEqual(3);
//   //     expect(gameBall.ySpeed).toEqual(2);
//   //   });
//   // });
//
//   describe("resets if ball passes through paddle side", function(){
//     var paddle3 = new Paddle(0, 0);
//     var player3 = new Player(paddle3)
//
//     beforeEach(function(){
//       for(var i = 0; i < 900;  i++) {
//         gameBall.update(player3, player2);
//       }
//     });
//
//     it("resets x and y coordinates when paddle fails", function(){
//
//       expect(gameBall.x).toEqual(300);
//       expect(gameBall.y).toEqual(20);
//     });
//
//     it("resets x and y coordinates when paddle fails", function(){
//       expect(gameBall.xSpeed).toEqual(3);
//       expect(gameBall.ySpeed).toEqual(2);
//     });
//   });
//
//   describe("increments", function() {
//     it("player 1 score", function() {
//       for(var i = 0; i < 290; i++) {
//         gameBall.update(player1, player2);
//       }
//       expect(player1.score).toEqual(1);
//     });
//     it("player 2 score", function() {
//       var paddle3 = new Paddle(0, 0);
//       var player3 = new Player(paddle3);
//       for(var i = 0; i < 100;  i++) {
//         gameBall.update(player3, player2);
//       }
//       expect(player2.score).toEqual(1);
//     });
//   });
// });
