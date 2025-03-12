const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'lime';
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
}

function update() {
    if (gameOver) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || checkSelfCollision(head)) {
        gameOver = true;
        alert(`Game Over! Score: ${score}`);
        return;
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

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

generateFood();
setInterval(update, 100);
