const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const turnDisplay = document.getElementById('turn');
const messageDisplay = document.getElementById('message');

const boardSize = 8;
const squareSize = canvas.width / boardSize;
let board = [];
let selectedPiece = null;
let currentPlayer = 'red';

// Initialize the board
function initializeBoard() {
  board = [];
  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      board[row][col] = null;
      if ((row + col) % 2 === 1) {
        if (row < 3) {
          board[row][col] = { color: 'black', isKing: false };
        } else if (row > 4) {
          board[row][col] = { color: 'red', isKing: false };
        }
      }
    }
  }
}

// Draw the board
function drawBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#eee' : '#777';
      ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
    }
  }
}

// Draw the pieces
function drawPieces() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const piece = board[row][col];
      if (piece) {
        ctx.beginPath();
        ctx.arc(col * squareSize + squareSize / 2, row * squareSize + squareSize / 2, squareSize / 2 - 10, 0, 2 * Math.PI);
        ctx.fillStyle = piece.color;
        ctx.fill();
        if (piece.isKing) {
          ctx.strokeStyle = 'gold';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      }
    }
  }
}

// Handle click events
function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / squareSize);
  const row = Math.floor(y / squareSize);

  if (selectedPiece) {
    movePiece(row, col);
  } else {
    selectPiece(row, col);
  }
}

// Select a piece
function selectPiece(row, col) {
  const piece = board[row][col];
  if (piece && piece.color === currentPlayer) {
    selectedPiece = { row, col };
    messageDisplay.textContent = '';
  } else {
    messageDisplay.textContent = 'Invalid selection.';
  }
}

// Move a piece
function movePiece(toRow, toCol) {
  const fromRow = selectedPiece.row;
  const fromCol = selectedPiece.col;
  const piece = board[fromRow][fromCol];

  if (isValidMove(fromRow, fromCol, toRow, toCol)) {
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;
    
    // Check for capture
    if (Math.abs(fromRow - toRow) === 2) {
        const capturedRow = (fromRow + toRow) / 2;
        const capturedCol = (fromCol + toCol) / 2;
        board[capturedRow][capturedCol] = null;
    }
    
    // Check for king
    if ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === boardSize - 1)) {
        piece.isKing = true;
    }

    selectedPiece = null;
    switchPlayer();
  } else {
    messageDisplay.textContent = 'Invalid move.';
  }
}

// Check if a move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    if (board[toRow][toCol] !== null) return false; // Destination occupied
    if (colDiff > 2 || colDiff === 0) return false; // Invalid move

    if (colDiff === 1) { // Normal move
        if (piece.color === 'red' && rowDiff !== -1 && !piece.isKing) return false;
        if (piece.color === 'black' && rowDiff !== 1 && !piece.isKing) return false;
        if (piece.isKing && Math.abs(rowDiff) !== 1) return false;
    } else if (colDiff === 2) { // Capture move
        const capturedRow = (fromRow + toRow) / 2;
        const capturedCol = (fromCol + toCol) / 2;
        const capturedPiece = board[capturedRow][capturedCol];
        if (!capturedPiece || capturedPiece.color === piece.color) return false;
        if (piece.color === 'red' && rowDiff !== -2 && !piece.isKing) return false;
        if (piece.color === 'black' && rowDiff !== 2 && !piece.isKing) return false;
        if (piece.isKing && Math.abs(rowDiff) !== 2) return false;
    }

    return true;
}

// Switch the current player
function switchPlayer() {
  currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
  turnDisplay.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`;
}

// Game loop
function gameLoop() {
  drawBoard();
  drawPieces();
  requestAnimationFrame(gameLoop);
}

// Initialize and start the game
initializeBoard();
canvas.addEventListener('click', handleClick);
gameLoop();
