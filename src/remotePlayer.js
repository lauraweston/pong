function Player(paddle, id, isOnLeft, name) {
  this.score = 0;
  this.paddle = paddle;
  this.id = id;
  this.isOnLeft = isOnLeft;
  this.name = ""
};

Player.prototype.setScore = function(newScore) {
  this.score = newScore;
};

Player.prototype.getScore = function() {
  return this.score;
};

Player.prototype.getName = function(){
  return this.name;
}

Player.prototype.setName = function(name){
  this.name = name;
}

module.exports = {
                  Player: Player,
                };
