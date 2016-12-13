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
  this.context.beginPath();
  this.context.setLineDash([5, 3]);
  this.context.lineWidth = 4;
  this.context.strokeStyle = '#FFFFFF';
  this.context.moveTo(300,0);
  this.context.lineTo(300,400);
  this.context.stroke();
};

module.exports = GameBox;
