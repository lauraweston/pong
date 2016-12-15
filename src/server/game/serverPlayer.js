function ServerPlayer(paddle, id) {
  this.score = 0;
  this.paddle = paddle;
  this.id = id;
  this.isReady = true;
};

ServerPlayer.prototype.getName = function(){
  return this.name;
};

ServerPlayer.prototype.setName = function(name){
  this.name = name;
};

ServerPlayer.prototype.isAssignedName = function() {
  if (this.name) {
    return true;
  };
  return false;
};

ServerPlayer.prototype.increaseScore = function() {
  this.score++;
};

ServerPlayer.prototype.getScore = function() {
  return this.score;
};

ServerPlayer.prototype.reset = function() {
  this.resetScore();
  this.setPlayerReady(true);
  this.paddle.reset();
};

ServerPlayer.prototype.resetScore = function() {
  this.score = 0;
};

ServerPlayer.prototype.setPlayerReady = function(boolean) {
  this.isReady = boolean;
};

module.exports = ServerPlayer;
