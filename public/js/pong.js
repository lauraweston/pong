var animate = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
function (callback) {window.setTimeout(callback, 10000 / 60)};


(function init(){
  var canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');
  game = new GameBox();
  ball = new Ball();
  animate(play);
})();

function play(){
  draw()
  update()
  animate(play)
};

var draw = function(){
  game.draw()
  ball.draw()
}

var update = function(){
  ball.update()
}
