var Ball = function(){
  this.x = 300
  this.y = 20
  this.xSpeed = 3
  this.ySpeed = 2
};

Ball.prototype.draw = function(){
  context.beginPath();
  context.arc(this.x,this.y,7,0,Math.PI*2,true)
  context.fillStyle = "white";
  context.closePath();
  context.fill();
};

Ball.prototype.update = function(player1, player2){
  this.x += this.xSpeed;
  this.y += this.ySpeed;

  if(this.x === player1.paddle.x && (this.y >= player1.paddle.y && this.y <= (player1.paddle.y + player1.paddle.height))) {
    this.xSpeed = -this.xSpeed;
  }

  if(this.x === (player2.paddle.x + player2.paddle.width) && (this.y >= player2.paddle.y && this.y <= (player2.paddle.y + player2.paddle.height))) {
    this.xSpeed = -this.xSpeed;
  }

  if(this.y <= 0) { // hits top
    this.ySpeed = -this.ySpeed;
  } else if(this.y > 400) { // hits bottom
    this.ySpeed = -this.ySpeed;
  }
  // paddle fails
  if(this.x >= 600) {
    player2.increaseScore();
    this.reset();
  } else if (this.x <= 0)  {
    player1.increaseScore();
    this.reset();
  }
};

Ball.prototype.reset = function(){
  this.x = 300;
  this.y = 20;
  this.xSpeed = 3;
  this.ySpeed = 2;
};
module.exports = Ball;
