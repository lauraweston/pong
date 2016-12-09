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
                };
