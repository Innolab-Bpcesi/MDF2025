const board = document.getElementById('board');
const minesLeftDisplay = document.getElementById('mines-left');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');

const BOARD_SIZE = 10;
const NUM_MINES = 10;

let cells = [];
let mines = [];
let revealedCells = 0;
let flagsPlaced = 0;
let gameStarted = false;
let gameOver = false;
let timer = 0;
let timerInterval;

// Initialize the game
function initializeGame() {
  createBoard();
  placeMines();
  updateMinesLeft();
  setupTimer();
  gameStarted = true;
  gameOver = false;
  revealedCells = 0;
  flagsPlaced = 0;
  messageDisplay.textContent = '';
}

// Create the board
function createBoard() {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

  cells = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    cells[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleCellClick);
      cell.addEventListener('contextmenu', handleRightClick);
      board.appendChild(cell);
      cells[i][j] = cell;
    }
  }
}

// Place mines randomly
function placeMines() {
  mines = [];
  while (mines.length < NUM_MINES) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    const isAlreadyMine = mines.some(mine => mine.row === row && mine.col === col);
    if (!isAlreadyMine) {
      mines.push({ row, col });
    }
  }
}

// Handle cell clicks
function handleCellClick(event) {
  if (gameOver) return;
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if(cell.classList.contains('flagged')) return;

  revealCell(row, col);
}

// Reveal a cell
function revealCell(row, col) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;

  const cell = cells[row][col];
  if (cell.classList.contains('revealed')) return;

  cell.classList.add('revealed');
  revealedCells++;

  const isMine = mines.some(mine => mine.row === row && mine.col === col);
  if (isMine) {
    cell.classList.add('mine');
    cell.textContent = '💣';
    gameOver = true;
    endGame(false);
  } else {
    const adjacentMines = countAdjacentMines(row, col);
    if (adjacentMines > 0) {
      cell.textContent = adjacentMines;
    } else {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(row + i, col + j);
        }
      }
    }
    checkWin();
  }
}

// Count adjacent mines
function countAdjacentMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
        const isMine = mines.some(mine => mine.row === newRow && mine.col === newCol);
        if (isMine) {
          count++;
        }
      }
    }
  }
  return count;
}

// Handle right click (flagging)
function handleRightClick(event) {
  event.preventDefault();
  if (gameOver) return;
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (!cell.classList.contains('revealed')) {
    if (cell.classList.contains('flagged')) {
      cell.classList.remove('flagged');
      cell.textContent = '';
      flagsPlaced--;
    } else if (flagsPlaced < NUM_MINES){
      cell.classList.add('flagged');
      cell.textContent = '🚩';
      flagsPlaced++;
    }
    updateMinesLeft();
  }
}

//Update mines left counter
function updateMinesLeft(){
    minesLeftDisplay.textContent = `Mines: ${NUM_MINES - flagsPlaced}`;
}

// Check for win
function checkWin() {
    if (revealedCells === BOARD_SIZE * BOARD_SIZE - NUM_MINES) {
        endGame(true);
    }
}

// End the game
function endGame(win) {
    gameOver = true;
    clearInterval(timerInterval);

    if (win) {
        messageDisplay.textContent = "You Win!";
    } else {
        messageDisplay.textContent = "You Lose!";
        //Show all mines
        for(let mine of mines){
            const cell = cells[mine.row][mine.col];
            if(!cell.classList.contains('revealed')){
                cell.classList.add('mine');
                cell.textContent = '💣';
            }
        }
    }

    //Remove event listeners
    for(let i = 0; i < BOARD_SIZE; i++){
        for(let j = 0; j < BOARD_SIZE; j++){
            const cell = cells[i][j];
            cell.removeEventListener('click', handleCellClick);
            cell.removeEventListener('contextmenu', handleRightClick);
        }
    }
}

// Setup timer
function setupTimer() {
  timer = 0;
  timerDisplay.textContent = `Time: ${timer}`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}`;
  }, 1000);
}

// Start the game
initializeGame();
