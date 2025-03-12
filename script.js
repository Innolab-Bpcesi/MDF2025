const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let gameLoop;
let gameStarted = false;
let gameSpeed = 150;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'lime';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
}

function update() {
    if (!gameStarted) return;

    if (gameOver) {
        clearInterval(gameLoop);
        if (confirm(`Game Over! Score: ${score}\nRetry?`)) {
            resetGame();
        }
        return;
    }

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    draw();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = {};
    direction = 'right';
    score = 0;
    gameOver = false;
    generateFood();
    scoreDisplay.textContent = `Score: ${score}`;
    gameLoop = setInterval(update, gameSpeed);
}

function startGame() {
    gameStarted = true;
    generateFood();
    gameLoop = setInterval(update, gameSpeed);
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        if (!gameStarted) {
            startGame();
        }
    } else {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down' && gameStarted) direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up' && gameStarted) direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right' && gameStarted) direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left' && gameStarted) direction = 'right';
                break;
        }
    }
});

draw();
