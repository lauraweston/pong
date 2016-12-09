function Player(paddle, id, isOnLeft, name) {
  this.score = 0;
  this.paddle = paddle;
  this.id = id;
  this.isOnLeft = isOnLeft;
  this.name = name;
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
