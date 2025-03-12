const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('nextPieceCanvas');
const nextPieceCtx = nextPieceCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

const BLOCK_SIZE = 32;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOS = [
  // I
  [[1, 1, 1, 1]],
  // J
  [[1, 0, 0], [1, 1, 1]],
  // L
  [[0, 0, 1], [1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // Z
  [[1, 1, 0], [0, 1, 1]],
];

const COLORS = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];

// Game variables
let board = [];
let currentTetromino;
let nextTetromino;
let currentX, currentY;
let score = 0;
let level = 1;
let dropCounter = 0;
let dropInterval = 1000; // milliseconds
let lastTime = 0;
let gameOver = false;

// Initialize the game
function initializeGame() {
  createBoard();
  createNewTetromino();
  updateScore();
  updateLevel();
  gameLoop();
}

// Create the board
function createBoard() {
  board = [];
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_WIDTH; col++) {
      board[row][col] = 0;
    }
  }
}

// Create a new tetromino
function createNewTetromino() {
  if (!nextTetromino) {
    nextTetromino = createRandomTetromino();
  }
  currentTetromino = nextTetromino;
  nextTetromino = createRandomTetromino();
  currentX = Math.floor(BOARD_WIDTH / 2) - Math.ceil(currentTetromino[0].length / 2);
  currentY = 0;
  drawNextTetromino();
  if (checkCollision()) {
    gameOver = true;
  }
}

// Create a random tetromino
function createRandomTetromino() {
  const index = Math.floor(Math.random() * TETROMINOS.length);
  const tetromino = TETROMINOS[index];
  tetromino.color = COLORS[index];
  return tetromino;
}

// Draw a block
function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw the board
function drawBoard() {
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (board[row][col]) {
        drawBlock(col, row, board[row][col]);
      }
    }
  }
}

// Draw the current tetromino
function drawTetromino() {
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col]) {
        drawBlock(currentX + col, currentY + row, currentTetromino.color);
      }
    }
  }
}

// Draw the next tetromino
function drawNextTetromino() {
  nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
  const offsetX = Math.floor((4 - nextTetromino[0].length) / 2);
  const offsetY = Math.floor((4 - nextTetromino.length) / 2);
  for (let row = 0; row < nextTetromino.length; row++) {
    for (let col = 0; col < nextTetromino[row].length; col++) {
      if (nextTetromino[row][col]) {
        drawNextBlock(offsetX + col, offsetY + row, nextTetromino.color);
      }
    }
  }
}

// Draw a block in the next tetromino preview
function drawNextBlock(x, y, color) {
  nextPieceCtx.fillStyle = color;
  nextPieceCtx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  nextPieceCtx.strokeStyle = 'black';
  nextPieceCtx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Check for collisions
function checkCollision(offsetX = 0, offsetY = 0, newTetromino = currentTetromino) {
  for (let row = 0; row < newTetromino.length; row++) {
    for (let col = 0; col < newTetromino[row].length; col++) {
      if (newTetromino[row][col]) {
        const x = currentX + col + offsetX;
        const y = currentY + row + offsetY;
        if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT || (y >= 0 && board[y][x])) {
          return true;
        }
      }
    }
  }
  return false;
}

// Merge the tetromino with the board
function mergeTetromino() {
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col]) {
        board[currentY + row][currentX + col] = currentTetromino.color;
      }
    }
  }
}

// Clear completed lines
function clearLines() {
  let linesCleared = 0;
  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (board[row].every((cell) => cell)) {
      linesCleared++;
      board.splice(row, 1);
      board.unshift(Array(BOARD_WIDTH).fill(0));
    }
  }
  if (linesCleared > 0) {
    updateScore(linesCleared);
  }
}

// Update the score
function updateScore(linesCleared = 0) {
  switch (linesCleared) {
    case 1:
      score += 40 * level;
      break;
    case 2:
      score += 100 * level;
      break;
    case 3:
      score += 300 * level;
      break;
    case 4:
      score += 1200 * level;
      break;
  }
  scoreDisplay.textContent = `Score: ${score}`;
}

// Update the level
function updateLevel() {
  level = Math.floor(score / 1000) + 1;
  levelDisplay.textContent = `Level: ${level}`;
  dropInterval = 1000 - (level - 1) * 100;
}

// Rotate the tetromino
function rotateTetromino() {
  const newTetromino = currentTetromino[0].map((val, index) =>
    currentTetromino.map((row) => row[index]).reverse()
  );
  if (!checkCollision(0, 0, newTetromino)) {
    currentTetromino = newTetromino;
  }
}

// Handle key presses
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      if (!checkCollision(-1)) {
        currentX--;
      }
      break;
    case 'ArrowRight':
      if (!checkCollision(1)) {
        currentX++;
      }
      break;
    case 'ArrowDown':
      if (!checkCollision(0, 1)) {
        currentY++;
      }
      break;
    case 'ArrowUp':
      rotateTetromino();
      break;
  }
});

// Game over
function gameOverFunc() {
  alert('Game Over!');
  // Reset the game (for now, just reload the page)
  location.reload();
}

// Game loop
function gameLoop(time = 0) {
  if (gameOver) {
    gameOverFunc();
    return;
  }
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    if (!checkCollision(0, 1)) {
      currentY++;
    } else {
      mergeTetromino();
      clearLines();
      updateLevel();
      createNewTetromino();
    }
    dropCounter = 0;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawTetromino();

  requestAnimationFrame(gameLoop);
}

// Start the game
initializeGame();
