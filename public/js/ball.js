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

  Ball.prototype.update = function(paddle1, paddle2){
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if(this.x === paddle1.x && (this.y >= paddle1.y && this.y <= (paddle1.y + paddle1.height))) {
      this.xSpeed = -this.xSpeed;
    }

    if(this.x === (paddle2.x + paddle2.width) && (this.y >= paddle2.y && this.y <= (paddle2.y + paddle2.height))) {
      this.xSpeed = -this.xSpeed;
    }

    if(this.y <= 0) { // hits top
        this.ySpeed = -this.ySpeed;
      } else if(this.y > 400) { // hits bottom
        this.ySpeed = -this.ySpeed;
      }
    // paddle fails
    if(this.x >= 600 || this.x <= 0) {
      this.reset();
    }

  Ball.prototype.reset = function(){
    this.x = 300;
    this.y = 20;
    this.xSpeed = 3;
    this.ySpeed = 2;
  };
};
module.exports = Ball;
