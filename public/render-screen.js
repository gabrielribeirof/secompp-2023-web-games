let squares = document.getElementById("game").children,
  modal = document.getElementsByClassName("modal")[0],
  message = document.getElementsByClassName("message")[0],
  resetBtn = document.getElementsByClassName("reset_btn")[0],
  indicator = document.getElementsByClassName("player_indicator")[0],
  turn = 0,
  player = "",
  moves = [];

indicator.textContent = "Player O it is your turn.";

function markBoard(e) {
  if (turn == 1 || turn % 2 !== 0) {
    player = "X";
  } else {
    player = "O";
  }

  moves.push({ square: e.target.dataset.index, player: player });

  for (let i = 0; i < squares.length; i++) {
    if (
      e.target.dataset.index == squares[i].dataset.index &&
      squares[i].textContent !== "X" &&
      squares[i].textContent !== "O"
    ) {
      squares[i].style.transition = "all 0.7s ease";
      squares[i].textContent = player;
      squares[i].classList.add("new-game_square");
      turn++;

      if (player == "X") {
        indicator.textContent = "Player O it is your turn.";
      } else {
        indicator.textContent = "Player X it is your turn.";
      }
    }
  }

  if (turn >= 3) {
    determineWinner();
  }
}

function determineWinner() {
  let playerMoves = [],
    playerSquares = [],
    playerWon = false;

  playerMoves.push(moves.filter((mark) => mark.player == player));

  for (let i = 0; i < playerMoves[0].length; i++) {
    playerSquares.push(playerMoves[0][i].square);
  }

  if (
    playerSquares.includes("1") &&
    playerSquares.includes("2") &&
    playerSquares.includes("3")
  ) {
    playerWon = true;
  } else if (
    playerSquares.includes("4") &&
    playerSquares.includes("5") &&
    playerSquares.includes("6")
  ) {
    playerWon = true;
  } else if (
    playerSquares.includes("7") &&
    playerSquares.includes("8") &&
    playerSquares.includes("9")
  ) {
    playerWon = true;
  } else if (
    playerSquares.includes("1") &&
    playerSquares.includes("5") &&
    playerSquares.includes("9")
  ) {
    playerWon = true;
  } else if (
    playerSquares.includes("3") &&
    playerSquares.includes("5") &&
    playerSquares.includes("7")
  ) {
    playerWon = true;
  } else if (
    playerSquares.includes("1") &&
    playerSquares.includes("4") &&
    playerSquares.includes("7")
  ) {
    playerWon = true;
  } else if (
    playerSquares.includes("2") &&
    playerSquares.includes("5") &&
    playerSquares.includes("8")
  ) {
    playerWon = true;
  } else if (
    playerSquares.includes("3") &&
    playerSquares.includes("6") &&
    playerSquares.includes("9")
  ) {
    playerWon = true;
  } else {
    playerWon = false;
  }

  if (playerWon == true) {
    message.textContent = `Jogador ${player} ganhou!`;
    modal.style.opacity = 1;
    modal.style.display = "flex";
    modal.style.zIndex = 99;
    indicator.textContent = "";
    resetBtn.style.display = "flex";
  } else if (turn == 9) {
    message.textContent = "EMPATE! ";
    resetBtn.style.display = "unset";

    modal.style.opacity = 1;
    modal.style.display = "flex";
    modal.style.zIndex = 99;
    indicator.textContent = "";
  }
}

for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener("click", markBoard);
}

function resetBoard() {
  moves = [];
  turn = 0;
  indicator.textContent = "Player O it is your turn.";

  modal.style.opacity = 0;
  modal.style.transition = "opacity 1s ease";
  modal.style.display = "none";

  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.remove("new-game_square");
    squares[i].classList.add("game_square");
    squares[i].style.transition = "none";
    squares[i].dataset.index = [i + 1];
    squares[i].textContent = "";
  }
}

resetBtn.addEventListener("click", resetBoard);
