function Player (paddle, context, name) {
  this.score = 0;
  this.id
  this.paddle = paddle;
  this.context = context;
  this.name = name
}

Player.prototype.draw = function() {
  this.paddle.draw();
  this.paddle.draw();
  this.context.font = '15px PongFont';
  this.context.fillText(this.name, this.paddle.x -10, 15);
  this.context.fillText(this.score, this.paddle.x, 30);
};

Player.prototype.setName = function(name){
  this.name = name;
};

Player.prototype.setScore = function(score){
  this.score = score;
};

module.exports = Player;
