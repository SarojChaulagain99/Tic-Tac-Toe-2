const cells = document.querySelectorAll<HTMLDivElement>(".cell");
const message = document.getElementById("message") as HTMLHeadingElement;

let board: string[] = ["", "", "", "", "", "", "", "", ""];
let gameActive: boolean = true;
let currentPlayer: string = "X";
let vsComputer: boolean = true; // toggle mode

const winPatterns: number[][] = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e: MouseEvent): void {
  const target = e.target as HTMLDivElement;
  const index = Number(target.dataset.index);

  if (board[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  if (checkWinner(currentPlayer)) {
    message.textContent = `${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    message.textContent = "It's a Tie!";
    gameActive = false;
    return;
  }

  // switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // computer move only if enabled and it's O's turn
  if (vsComputer && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  } else {
    message.textContent = `${currentPlayer}'s Turn`;
  }
}

function makeMove(index: number, player: string): void {
  board[index] = player;
  cells[index].textContent = player;
}

function computerMove(): void {
  let emptyCells = board
    .map((val, idx) => val === "" ? idx : null)
    .filter((val): val is number => val !== null);

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  makeMove(randomIndex, "O");

  if (checkWinner("O")) {
    message.textContent = "Computer Wins!";
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    message.textContent = "It's a Tie!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  message.textContent = "X's Turn";
}

function checkWinner(player: string): boolean {
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

function resetGame(): void {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  message.textContent = "X's Turn";
  cells.forEach(cell => cell.textContent = "");
}

// toggle mode
function toggleMode(): void {
  vsComputer = !vsComputer;
  resetGame();
  message.textContent = vsComputer ? "Player vs Computer" : "2 Player Mode";
}