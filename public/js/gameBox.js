function GameBox(){
  this.height = 400;
  this.width= 600;
  this.x = 0;
  this.y = 0;
};

GameBox.prototype.draw = function(){
  context.beginPath();
  context.rect(this.x, this.y, this.width, this.height)
  context.fillStyle = "black";
  context.fill();
  context.closePath();
};

module.exports = GameBox;
