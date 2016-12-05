function GameBox(){
};

GameBox.prototype.draw = function(){
  context.beginPath();
  context.rect(0, 0, 600, 400)
  context.fillStyle = "black";
  context.fill();
  context.closePath();
};
