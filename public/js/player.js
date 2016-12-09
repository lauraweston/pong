function Player (paddle, context) {
  this.score = 0;
  this.id
  this.paddle = paddle;
  this.context = context;
}

Player.prototype.increaseScore = function() {
  this.score++;
};

Player.prototype.draw = function() {
  this.context.fillText(this.score, this.paddle.x, 15);
};

Player.prototype.setScore = function(newScore) {
  this.score = newScore;
};

Player.prototype.getScore = function() {
  return this.score;
};


module.exports = Player;
