function Player(paddle, id, isOnLeft, name) {
  this.score = 0;
  this.paddle = paddle;
  this.id = id;
  this.isOnLeft = isOnLeft;
  this.name = ""
};

Player.prototype.getName = function(){
  return this.name;
}

Player.prototype.setName = function(name){
  this.name = name;
}

Player.prototype.increaseScore = function() {
  this.score++;
};

Player.prototype.getScore = function() {
  return this.score;
};

module.exports = Player;
