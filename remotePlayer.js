function Paddle(x, y) {
  this.color = "white";
  this.width = 15;
  this.height = 70;
  this.x = x;
  this.y = y;
  this.ySpeed = 5;
};

Paddle.prototype.setY = function(y) {
  this.y = y;
}

Paddle.prototype.setX = function(x) {
  this.x = x;
}

Paddle.prototype.getY = function() {
  return this.y;
}

Paddle.prototype.getX = function() {
  return this.x;
}

function Player(paddle, id, isOnLeft) {
  this.score = 0;
  this.paddle = paddle;
  this.id = id;
  this.isOnLeft = isOnLeft;
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
