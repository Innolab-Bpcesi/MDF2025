const gameCanvas = document.getElementById('gameCanvas');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

const gridSize = 5;
let board = [];
let emptyRow, emptyCol;
let gameActive = true;

function createBoard() {
    let count = 1;
    for (let row = 0; row < gridSize; row++) {
        board[row] = [];
        for (let col = 0; col < gridSize; col++) {
            board[row][col] = count;
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = count;
            cell.addEventListener('click', handleCellClick);
            gameCanvas.appendChild(cell);
            count++;
        }
    }
    board[gridSize - 1][gridSize - 1] = 0;
    emptyRow = gridSize - 1;
    emptyCol = gridSize - 1;
    const emptyCell = gameCanvas.querySelector(`[data-row="${emptyRow}"][data-col="${emptyCol}"]`);
    emptyCell.classList.add('empty');
    emptyCell.textContent = '';
}

function drawBoard() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = gameCanvas.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.textContent = board[row][col] === 0 ? '' : board[row][col];
            if (board[row][col] === 0) {
                cell.classList.add('empty');
            } else {
                cell.classList.remove('empty');
            }
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (isAdjacent(row, col)) {
        swapCells(row, col);
        drawBoard();
        if (checkWin()) {
            endGame();
        }
    }
}

function isAdjacent(row, col) {
    return (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
}

function swapCells(row, col) {
    const temp = board[row][col];
    board[row][col] = board[emptyRow][emptyCol];
    board[emptyRow][emptyCol] = temp;
    emptyRow = row;
    emptyCol = col;
}

function checkWin() {
    let count = 1;
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (row === gridSize - 1 && col === gridSize - 1) {
                if (board[row][col] !== 0) return false;
            } else {
                if (board[row][col] !== count) return false;
            }
            count++;
        }
    }
    return true;
}

function endGame() {
    gameActive = false;
    message.textContent = 'You Win!';
}

function shuffleBoard() {
    for (let i = 0; i < 1000; i++) {
        const adjacentCells = [];
        if (emptyRow > 0) adjacentCells.push([emptyRow - 1, emptyCol]);
        if (emptyRow < gridSize - 1) adjacentCells.push([emptyRow + 1, emptyCol]);
        if (emptyCol > 0) adjacentCells.push([emptyRow, emptyCol - 1]);
        if (emptyCol < gridSize - 1) adjacentCells.push([emptyRow, emptyCol + 1]);

        const randomCell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];
        swapCells(randomCell[0], randomCell[1]);
    }
    drawBoard();
    gameActive = true;
    message.textContent = '';
}

createBoard();
resetButton.addEventListener('click', shuffleBoard);
