function getWinner(player1, player2){
  if (player1 && player1.score > 9) {
    return player1;
  }
  if (player2 && player2.score > 9) {
    return player2;
  }
  return null;
};

function getPlayerScores(player1, player2) {
  return {
    player1: {id: player1.id, score: player1.getScore()},
    player2: {id: player2.id, score: player2.getScore()}
  };
};

function getOpponent(id, player1, player2) {
  var player = getPlayerById(id, player1, player2);
  if (player === player1) {
    return player2;
  } else if(player === player2){
    return player1;
  }
	return false;
};

function getPlayerById(id, player1, player2) {
	if (player1 && player1.id === id) {
    return player1;
  }
  if (player2 && player2.id === id) {
    return player2;
  }
	return false;
};

module.exports = {
  getPlayerScores: getPlayerScores,
  getWinner: getWinner,
  getOpponent: getOpponent,
  getPlayerById: getPlayerById
}
