const gameboard = document.getElementById('gameboard');
const message = document.getElementById('message');
const blackScoreDisplay = document.getElementById('blackScore');
const whiteScoreDisplay = document.getElementById('whiteScore');
const resetButton = document.getElementById('resetButton');

let board = [];
let currentPlayer = 'black';
let gameActive = true;

const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
];

function createBoard() {
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            board[i][j] = null;
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameboard.appendChild(cell);
        }
    }
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
}

function drawBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = gameboard.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            cell.innerHTML = '';
            if (board[i][j]) {
                const disc = document.createElement('div');
                disc.classList.add('disc', board[i][j]);
                cell.appendChild(disc);
            }
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (isValidMove(row, col)) {
        placeDisc(row, col);
        flipDiscs(row, col);
        drawBoard();
        updateScore();
        if (checkGameOver()) {
            endGame();
        } else {
            switchPlayer();
        }
    }
}

function isValidMove(row, col) {
    if (board[row][col]) return false;

    for (const dir of directions) {
        if (checkDirection(row, col, dir[0], dir[1])) {
            return true;
        }
    }
    return false;
}

function checkDirection(row, col, rowDir, colDir) {
    let r = row + rowDir;
    let c = col + colDir;
    let foundOpponent = false;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === null) return false;
        if (board[r][c] === currentPlayer) return foundOpponent;
        foundOpponent = true;
        r += rowDir;
        c += colDir;
    }
    return false;
}

function placeDisc(row, col) {
    board[row][col] = currentPlayer;
}

function flipDiscs(row, col) {
    for (const dir of directions) {
        flipDirection(row, col, dir[0], dir[1]);
    }
}

function flipDirection(row, col, rowDir, colDir) {
    let r = row + rowDir;
    let c = col + colDir;
    const discsToFlip = [];

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (board[r][c] === null) return;
        if (board[r][c] === currentPlayer) {
            for (const disc of discsToFlip) {
                board[disc[0]][disc[1]] = currentPlayer;
            }
            return;
        }
        discsToFlip.push([r, c]);
        r += rowDir;
        c += colDir;
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    message.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
    if (!hasValidMoves()) {
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        message.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn (No valid moves for the previous player)`;
        if (!hasValidMoves()) {
            endGame();
        }
    }
}

function hasValidMoves() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isValidMove(i, j)) {
                return true;
            }
        }
    }
    return false;
}

function updateScore() {
    let blackScore = 0;
    let whiteScore = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'black') blackScore++;
            else if (board[i][j] === 'white') whiteScore++;
        }
    }
    blackScoreDisplay.textContent = `Black: ${blackScore}`;
    whiteScoreDisplay.textContent = `White: ${whiteScore}`;
}

function checkGameOver() {
    return !hasValidMoves() && !hasValidMovesForOpponent();
}

function hasValidMovesForOpponent() {
    const opponent = currentPlayer === 'black' ? 'white' : 'black';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === null) {
                const tempCurrentPlayer = currentPlayer;
                currentPlayer = opponent;
                const isValid = isValidMove(i, j);
                currentPlayer = tempCurrentPlayer;
                if (isValid) return true;
            }
        }
    }
    return false;
}

function endGame() {
    gameActive = false;
    let blackScore = 0;
    let whiteScore = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === 'black') blackScore++;
            else if (board[i][j] === 'white') whiteScore++;
        }
    }
    if (blackScore > whiteScore) {
        message.textContent = `Black wins!`;
    } else if (whiteScore > blackScore) {
        message.textContent = `White wins!`;
    } else {
        message.textContent = `It's a draw!`;
    }
}

function resetGame() {
    board = [];
    currentPlayer = 'black';
    gameActive = true;
    createBoard();
    drawBoard();
    updateScore();
    message.textContent = "Black's turn";
}

createBoard();
drawBoard();
updateScore();
message.textContent = "Black's turn";
resetButton.addEventListener('click', resetGame);
