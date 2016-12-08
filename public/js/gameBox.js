function GameBox(context){
  this.context = context;
  this.height = 400;
  this.width= 600;
  this.x = 0;
  this.y = 0;
};

GameBox.prototype.draw = function(){
  this.context.beginPath();
  this.context.rect(this.x, this.y, this.width, this.height)
  this.context.fillStyle = "black";
  this.context.fill();
  this.context.closePath();
};

module.exports = GameBox;
