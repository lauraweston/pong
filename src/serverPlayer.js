function Player(paddle, id) {
  this.score = 0;
  this.paddle = paddle;
  this.id = id;
  this.name = "";
  this.isReady = true;
};

Player.prototype.getName = function(){
  return this.name;
};

Player.prototype.setName = function(name){
  this.name = name;
};

Player.prototype.increaseScore = function() {
  this.score++;
};

Player.prototype.getScore = function() {
  return this.score;
};

Player.prototype.reset = function() {
  this.resetScore();
  this.setPlayStatus(true);
};

Player.prototype.resetScore = function() {
  this.score = 0;
};

Player.prototype.setPlayStatus = function(boolean) {
  this.isReady = boolean;
};

module.exports = Player;
