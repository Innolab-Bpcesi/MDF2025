const gameContainer = document.getElementById('game-container');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-button');
const startButton = document.getElementById('start-button');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
const playerSetup = document.getElementById('player-setup');
const gameInfo = document.getElementById('game-info');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let player1Score = 0;
let player2Score = 0;

// Winning combinations
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Create the board
function createBoard() {
  gameContainer.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    gameContainer.appendChild(cell);
    cell.addEventListener('click', handleCellClick);
  }
}

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
    message.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} wins!`;
    updateScore();
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
  message.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn`;
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

// Update the score
function updateScore() {
  if (currentPlayer === 'X') {
    player1Score++;
    player1ScoreDisplay.textContent = `${player1Name} (X): ${player1Score}`;
  } else {
    player2Score++;
    player2ScoreDisplay.textContent = `${player2Name} (O): ${player2Score}`;
  }
}

// Reset the game
function resetGame() {
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  message.textContent = `${player1Name}'s turn`;
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => cell.textContent = '');
}

// Start the game
function startGame() {
  player1Name = player1NameInput.value || 'Player 1';
  player2Name = player2NameInput.value || 'Player 2';
  player1ScoreDisplay.textContent = `${player1Name} (X): 0`;
  player2ScoreDisplay.textContent = `${player2Name} (O): 0`;
  message.textContent = `${player1Name}'s turn`;
  playerSetup.style.display = 'none';
  gameInfo.style.display = 'flex';
  resetButton.style.display = 'block';
  gameActive = true;
  createBoard();
}

// Add event listeners
resetButton.addEventListener('click', resetGame);
startButton.addEventListener('click', startGame);
