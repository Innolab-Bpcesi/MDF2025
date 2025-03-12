const gameCanvas = document.getElementById('gameCanvas');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

let board = [];
let selectedCell = null;
let possibleMoves = [];
let currentPlayer = 'white';
let gameActive = true;

const pieces = {
    'R': '&#9814;', // Black Rook
    'N': '&#9816;', // Black Knight
    'B': '&#9815;', // Black Bishop
    'Q': '&#9813;', // Black Queen
    'K': '&#9812;', // Black King
    'P': '&#9817;', // Black Pawn
    'r': '&#9820;', // White Rook
    'n': '&#9822;', // White Knight
    'b': '&#9821;', // White Bishop
    'q': '&#9819;', // White Queen
    'k': '&#9818;', // White King
    'p': '&#9823;', // White Pawn
};

function createBoard() {
    const initialBoard = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ];

    for (let row = 0; row < 8; row++) {
        board[row] = [];
        for (let col = 0; col < 8; col++) {
            board[row][col] = initialBoard[row][col];
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameCanvas.appendChild(cell);
        }
    }
    drawBoard();
}

function drawBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = gameCanvas.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.innerHTML = board[row][col] ? pieces[board[row][col]] : '';
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedCell) {
        const [selRow, selCol] = selectedCell;
        if (possibleMoves.some(([r, c]) => r === row && c === col)) {
            board[row][col] = board[selRow][selCol];
            board[selRow][selCol] = null;
            drawBoard();
            switchPlayer();
        }
        clearSelection();
    } else {
        if (board[row][col] && isCurrentPlayerPiece(board[row][col])) {
            selectCell(row, col);
        }
    }
}

function isCurrentPlayerPiece(piece) {
    return (currentPlayer === 'white' && piece === piece.toLowerCase()) ||
           (currentPlayer === 'black' && piece === piece.toUpperCase());
}

function selectCell(row, col) {
    selectedCell = [row, col];
    possibleMoves = getPossibleMoves(row, col);
    const cell = gameCanvas.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('selected');
    possibleMoves.forEach(([r, c]) => {
        const possibleCell = gameCanvas.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        possibleCell.classList.add('possible');
    });
}

function clearSelection() {
    if (selectedCell) {
        const [row, col] = selectedCell;
        const cell = gameCanvas.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.remove('selected');
        possibleMoves.forEach(([r, c]) => {
            const possibleCell = gameCanvas.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            possibleCell.classList.remove('possible');
        });
        selectedCell = null;
        possibleMoves = [];
    }
}

function getPossibleMoves(row, col) {
    const piece = board[row][col];
    const moves = [];
    // Basic moves for now (only pawn)
    if (piece === 'p') {
        if (row > 0 && board[row - 1][col] === null) moves.push([row - 1, col]);
        if (row === 6 && board[row - 2][col] === null && board[row - 1][col] === null) moves.push([row - 2, col]);
        if (row > 0 && col > 0 && board[row - 1][col - 1] && board[row - 1][col - 1].toUpperCase() === board[row - 1][col - 1]) moves.push([row - 1, col - 1]);
        if (row > 0 && col < 7 && board[row - 1][col + 1] && board[row - 1][col + 1].toUpperCase() === board[row - 1][col + 1]) moves.push([row - 1, col + 1]);
    } else if (piece === 'P') {
        if (row < 7 && board[row + 1][col] === null) moves.push([row + 1, col]);
        if (row === 1 && board[row + 2][col] === null && board[row + 1][col] === null) moves.push([row + 2, col]);
        if (row < 7 && col > 0 && board[row + 1][col - 1] && board[row + 1][col - 1].toLowerCase() === board[row + 1][col - 1]) moves.push([row + 1, col - 1]);
        if (row < 7 && col < 7 && board[row + 1][col + 1] && board[row + 1][col + 1].toLowerCase() === board[row + 1][col + 1]) moves.push([row + 1, col + 1]);
    }
    return moves;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    message.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
}

function resetGame() {
    board = [];
    selectedCell = null;
    possibleMoves = [];
    currentPlayer = 'white';
    gameActive = true;
    message.textContent = "White's turn";
    gameCanvas.innerHTML = '';
    createBoard();
}

createBoard();
resetButton.addEventListener('click', resetGame);
