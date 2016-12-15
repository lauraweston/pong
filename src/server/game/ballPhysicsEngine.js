function ballHitsWall(ball, gameBox){
  if(ball.y <= gameBox.y || ball.y >= gameBox.height) {
    ball.bounceWall();
  }
}

function ballHitsPaddle(ball, player1, player2){
  if(ball.x >= player1.paddle.x && ball.x <= (player1.paddle.x + player1.paddle.width) && (ball.y >= player1.paddle.y && ball.y <= (player1.paddle.y + player1.paddle.height))) {
    ball.bouncePaddle();
  }
  if(ball.x >= player2.paddle.x && ball.x <= (player2.paddle.x + player2.paddle.width) && (ball.y >= player2.paddle.y && ball.y <= (player2.paddle.y + player2.paddle.height))) {
    ball.bouncePaddle();
  }
}

function ballGoesOutOfPlay(ball, gameBox, player1, player2){
  if (ball.x >= gameBox.width) {
    player1.increaseScore();
    ball.reset();
  } else if (ball.x <= gameBox.x) {
    player2.increaseScore();
    ball.reset();
  }
}

module.exports = {
  ballHitsWall: ballHitsWall,
  ballHitsPaddle: ballHitsPaddle,
  ballGoesOutOfPlay: ballGoesOutOfPlay
};
