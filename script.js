const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const BOARD_SIZE = 8;
const ANIMAL_TYPES = ['🦁', '🦒', '🐘', '🦓', '🐒', '🦧']; // Animal emojis
let grid = [];
let score = 0;
let selectedCell = null;

// Initialize the game
function initializeGame() {
  createBoard();
  populateBoard();
  updateScore();
}

// Create the board
function createBoard() {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  grid = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      board.appendChild(cell);
      grid[row][col] = cell;
    }
  }
}

// Populate the board with random animals
function populateBoard() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const animal = getRandomAnimal();
      grid[row][col].textContent = animal;
    }
  }
}

// Get a random animal
function getRandomAnimal() {
  return ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)];
}

// Handle cell clicks
function handleCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (selectedCell) {
    const [selRow, selCol] = selectedCell;
    if (isAdjacent(row, col, selRow, selCol)) {
      swapAnimals(row, col, selRow, selCol);
      if (!findMatches()){
        swapAnimals(row, col, selRow, selCol);
      } else {
        removeMatches();
        updateBoard();
        
      }
    }
    selectedCell = null;
  } else {
    selectedCell = [row, col];
  }
}

// Check if two cells are adjacent
function isAdjacent(row1, col1, row2, col2) {
  return (Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1);
}

// Swap animals between two cells
function swapAnimals(row1, col1, row2, col2) {
  const temp = grid[row1][col1].textContent;
  grid[row1][col1].textContent = grid[row2][col2].textContent;
  grid[row2][col2].textContent = temp;
}

// Check for matches
function findMatches() {
    let matches = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (checkMatch(row, col)) {
                matches = true;
            }
        }
    }

    return matches;
}

// Check for a match starting from a given cell
function checkMatch(row, col) {
    const animal = grid[row][col].textContent;

    // Check horizontal match
    let horizontalMatch = 1;
    for (let c = col + 1; c < BOARD_SIZE; c++) {
        if (grid[row][c].textContent === animal) {
            horizontalMatch++;
        } else {
            break;
        }
    }
    if (horizontalMatch >= 3) {
        return true;
    }

    // Check vertical match
    let verticalMatch = 1;
    for (let r = row + 1; r < BOARD_SIZE; r++) {
        if (grid[r][col].textContent === animal) {
            verticalMatch++;
        } else {
            break;
        }
    }
    if (verticalMatch >= 3) {
        return true;
    }
    return false;
}

// Remove matches
function removeMatches() {
  const matchedCells = new Set();

  // Find horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE - 2; col++) {
      const animal = grid[row][col].textContent;
      if (grid[row][col + 1].textContent === animal && grid[row][col + 2].textContent === animal) {
        for (let c = col; c < BOARD_SIZE; c++){
          if(grid[row][c].textContent === animal){
            matchedCells.add(grid[row][c]);
          } else{
            break;
          }
        }
      }
    }
  }

  // Find vertical matches
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row < BOARD_SIZE - 2; row++) {
      const animal = grid[row][col].textContent;
      if (grid[row + 1][col].textContent === animal && grid[row + 2][col].textContent === animal) {
        for(let r = row; r < BOARD_SIZE; r++){
          if(grid[r][col].textContent === animal){
            matchedCells.add(grid[r][col]);
          } else {
            break;
          }
        }
      }
    }
  }
  matchedCells.forEach((cell) => {
    cell.textContent = '';
    score += 10;
  });
  updateScore();
}

// Update the board after removing matches
function updateBoard() {
    // Drop down animals
    for (let col = 0; col < BOARD_SIZE; col++) {
        let emptyRow = BOARD_SIZE - 1;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (grid[row][col].textContent !== '') {
                grid[emptyRow][col].textContent = grid[row][col].textContent;
                if (row !== emptyRow) {
                    grid[row][col].textContent = '';
                }
                emptyRow--;
            }
        }
    }

    // Fill empty spaces with new animals
    for (let col = 0; col < BOARD_SIZE; col++) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            if (grid[row][col].textContent === '') {
                grid[row][col].textContent = getRandomAnimal();
            }
        }
    }
    if(findMatches()){
        removeMatches();
        updateBoard();
    }
}

// Update the score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Start the game
initializeGame();
