const gameboard = document.getElementById('gameboard');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

let board = [];
let currentPlayer = 1; // 1 for red, 2 for yellow
let gameActive = true;

function createBoard() {
    for (let row = 0; row < 6; row++) {
        board[row] = [];
        for (let col = 0; col < 7; col++) {
            board[row][col] = 0;
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameboard.appendChild(cell);
        }
    }
}

function drawBoard() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = gameboard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.innerHTML = '';
            if (board[row][col] !== 0) {
                const disc = document.createElement('div');
                disc.classList.add('disc', board[row][col] === 1 ? 'red' : 'yellow');
                cell.appendChild(disc);
            }
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const col = parseInt(cell.dataset.col);

    if (dropDisc(col)) {
        drawBoard();
        if (checkWinner()) {
            endGame();
        } else if (checkDraw()) {
            drawGame();
        } else {
            switchPlayer();
        }
    }
}

function dropDisc(col) {
    for (let row = 5; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            return true;
        }
    }
    return false;
}

function checkWinner() {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                board[row][col] !== 0 &&
                board[row][col] === board[row][col + 1] &&
                board[row][col] === board[row][col + 2] &&
                board[row][col] === board[row][col + 3]
            ) {
                return true;
            }
        }
    }

    // Check vertical
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            if (
                board[row][col] !== 0 &&
                board[row][col] === board[row + 1][col] &&
                board[row][col] === board[row + 2][col] &&
                board[row][col] === board[row + 3][col]
            ) {
                return true;
            }
        }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                board[row][col] !== 0 &&
                board[row][col] === board[row + 1][col + 1] &&
                board[row][col] === board[row + 2][col + 2] &&
                board[row][col] === board[row + 3][col + 3]
            ) {
                return true;
            }
        }
    }

    // Check diagonal (top-right to bottom-left)
    for (let row = 0; row < 3; row++) {
        for (let col = 3; col < 7; col++) {
            if (
                board[row][col] !== 0 &&
                board[row][col] === board[row + 1][col - 1] &&
                board[row][col] === board[row + 2][col - 2] &&
                board[row][col] === board[row + 3][col - 3]
            ) {
                return true;
            }
        }
    }

    return false;
}

function checkDraw() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    message.textContent = `Player ${currentPlayer}'s turn (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
}

function endGame() {
    gameActive = false;
    message.textContent = `Player ${currentPlayer} wins! (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
}

function drawGame(){
    gameActive = false;
    message.textContent = `It's a draw!`;
}

function resetGame() {
    board = [];
    currentPlayer = 1;
    gameActive = true;
    message.textContent = "Player 1's turn (Red)";
    gameboard.innerHTML = '';
    createBoard();
}

createBoard();
resetButton.addEventListener('click', resetGame);
