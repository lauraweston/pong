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

  Ball.prototype.update = function(paddle){
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if(this.x === paddle.x && (this.y >= paddle.y && this.y <= (paddle.y + paddle.height))) {
      this.xSpeed = -this.xSpeed;
    }

    if(this.y <= 0) { // hits top
        this.ySpeed = -this.ySpeed;
      } else if(this.y > 400) { // hits bottom
        this.ySpeed = -this.ySpeed;
      } else if(this.x <= 0){
          this.xSpeed = -this.xSpeed;
      }
    // paddle fails
    if(this.x >= 600) {
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
