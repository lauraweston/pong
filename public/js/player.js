function Player (paddle) {
  this.score = 0;
  this.paddle = paddle;
};

Player.prototype.increaseScore = function() {
  this.score++;
};

Player.prototype.draw = function() {
  context.fillText(this.score, this.paddle.x, 15);
};

module.exports = Player;
