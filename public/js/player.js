function Player (paddle, context, name) {
  this.score = 0;
  this.id
  this.paddle = paddle;
  this.context = context;
  this.name = name
}

Player.prototype.draw = function() {
  this.context.fillText("vs", 300, 10);
  this.context.fillText(this.name, this.paddle.x - 10, 10);
  this.context.fillText(this.score, this.paddle.x, 20);
};

Player.prototype.getName = function(){
  return this.name;
};

Player.prototype.setName = function(name){
  this.name = name;
};

module.exports = Player;
