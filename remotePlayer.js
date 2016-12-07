function Paddle(x, y) {
  this.color = "white";
  this.width = 15;
  this.height = 70;
  this.x = x;
  this.y = y;
  this.ySpeed = 5;
};

Paddle.prototype.setPosition = function(position) {
  this.y = position;
}

Paddle.prototype.getPosition = function() {
  return this.y;
}

function Player(paddle) {
  this.score = 0;
  this.paddle = paddle;
  this.id;
};

Player.prototype.setScore = function(newScore) {
  this.score = newScore;
};

Player.prototype.getScore = function() {
  return this.score;
};


module.exports = {
                  Player: Player,
                  Paddle: Paddle
                };
