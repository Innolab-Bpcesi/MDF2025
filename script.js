const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle cell click
function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.dataset.index);

  if (board[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  board[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  if (checkWin()) {
    message.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    message.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  switchPlayer();
}

// Switch player
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  message.textContent = `Player ${currentPlayer}'s turn`;
}

// Check for win
function checkWin() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

// Check for draw
function checkDraw() {
  return board.every(cell => cell !== '');
}

// Reset the game
function resetGame() {
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  message.textContent = `Player X's turn`;
  cells.forEach(cell => cell.textContent = '');
}

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
