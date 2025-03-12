const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

const grid = 20; // Size of each grid cell
const width = 10; // Width of the game board in cells
const height = 20; // Height of the game board in cells

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let dropCounter = 0;
let dropInterval = 1000; // Initial drop speed (1 second)
let lastTime = 0;

// Tetromino shapes
const pieces = [
    [
        [1, 1, 1, 1],
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
    ],
    [
        [1, 1],
        [1, 1],
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
    ],
    [
        [1, 1, 1],
        [0, 0, 1],
    ],
];

// Create the game board
function createBoard() {
    for (let i = 0; i < height; i++) {
        board[i] = [];
        for (let j = 0; j < width; j++) {
            board[i][j] = 0;
        }
    }
}

// Create a new piece
function createPiece() {
    const type = nextPiece || Math.floor(Math.random() * pieces.length);
    nextPiece = Math.floor(Math.random() * pieces.length);
    const piece = {
        shape: pieces[type],
        x: Math.floor(width / 2) - Math.ceil(pieces[type][0].length / 2),
        y: -2,
        color: type,
    };
    return piece;
}

// Draw a piece
function drawPiece(piece, context) {
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
            if (piece.shape[i][j]) {
                context.fillStyle = getPieceColor(piece.color);
                context.fillRect((piece.x + j) * grid, (piece.y + i) * grid, grid, grid);
                context.strokeStyle = 'black';
                context.strokeRect((piece.x + j) * grid, (piece.y + i) * grid, grid, grid);
                context.beginPath();
                context.arc((piece.x + j) * grid + grid / 2, (piece.y + i) * grid + grid / 2, grid / 2, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }
}

// Draw the board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (board[i][j]) {
                ctx.fillStyle = getPieceColor(board[i][j] - 1);
                ctx.fillRect(j * grid, i * grid, grid, grid);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(j * grid, i * grid, grid, grid);
                ctx.beginPath();
                ctx.arc(j * grid + grid / 2, i * grid + grid / 2, grid / 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

// Draw the next piece
function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    const piece = {
        shape: pieces[nextPiece],
        x: 1,
        y: 1,
        color: nextPiece,
    };
    drawPiece(piece, nextCtx);
}

// Get the color of a piece
function getPieceColor(type) {
    const colors = ['cyan', 'purple', 'orange', 'blue', 'yellow', 'green', 'red'];
    return colors[type];
}

// Check for collisions
function checkCollision(piece, x, y) {
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
            if (piece.shape[i][j]) {
                const newX = piece.x + j + x;
                const newY = piece.y + i + y;
                if (newX < 0 || newX >= width || newY >= height || (newY >= 0 && board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merge the piece with the board
function mergePiece() {
    for (let i = 0; i < currentPiece.shape.length; i++) {
        for (let j = 0; j < currentPiece.shape[i].length; j++) {
            if (currentPiece.shape[i][j]) {
                const x = currentPiece.x + j;
                const y = currentPiece.y + i;
                if (y >= 0) {
                    board[y][x] = currentPiece.color + 1;
                }
            }
        }
    }
}

// Clear completed lines
function clearLines() {
    let linesCleared = 0;
    for (let i = height - 1; i >= 0; i--) {
        if (board[i].every((cell) => cell)) {
            linesCleared++;
            board.splice(i, 1);
            board.unshift(Array(width).fill(0));
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreDisplay.textContent = `Score: ${score}`;
        if (score >= level * 500) {
            level++;
            levelDisplay.textContent = `Level: ${level}`;
            dropInterval -= 100;
        }
    }
}

// Game loop
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        currentPiece.y++;
        if (checkCollision(currentPiece, 0, 1)) {
            currentPiece.y--;
            mergePiece();
            clearLines();
            currentPiece = createPiece();
            if (checkCollision(currentPiece, 0, 0)) {
                // Game Over
                board = [];
                createBoard();
                score = 0;
                level = 1;
                dropInterval = 1000;
                scoreDisplay.textContent = `Score: ${score}`;
                levelDisplay.textContent = `Level: ${level}`;
            }
        }
        dropCounter = 0;
    }

    drawBoard();
    drawPiece(currentPiece, ctx);
    drawNextPiece();
    requestAnimationFrame(update);
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            if (!checkCollision(currentPiece, -1, 0)) {
                currentPiece.x--;
            }
            break;
        case 'ArrowRight':
            if (!checkCollision(currentPiece, 1, 0)) {
                currentPiece.x++;
            }
            break;
        case 'ArrowDown':
            if (!checkCollision(currentPiece, 0, 1)) {
                currentPiece.y++;
            }
            break;
        case 'ArrowUp':
            const rotated = [];
            for (let i = 0; i < currentPiece.shape[0].length; i++) {
                const row = [];
                for (let j = currentPiece.shape.length - 1; j >= 0; j--) {
                    row.push(currentPiece.shape[j][i]);
                }
                rotated.push(row);
            }
            if (!checkCollision({ ...currentPiece, shape: rotated }, 0, 0)) {
                currentPiece.shape = rotated;
            }
            break;
    }
});

// Initialize the game
createBoard();
currentPiece = createPiece();
update();
