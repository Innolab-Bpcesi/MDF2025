const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Game variables
let score = 0;
let isJumping = false;
let jumpHeight = 100;
let gravity = 5;
let jumpForce = 20;
let playerY = canvas.height - 50; // Initial Y position on the ground
let playerX = 50;
let playerWidth = 30;
let playerHeight = 50;
let playerYVelocity = 0;
let rocks = [];
let rockSpeed = 5;
let gameLoopInterval;
let gameOver = false;

// Player
const player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight,
    color: 'blue',
};

// Rock
class Rock {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height - 30;
        this.width = 30;
        this.height = 30;
        this.color = 'brown';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= rockSpeed;
    }
}

// Functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawPlayer() {
    drawRect(player.x, player.y, player.width, player.height, player.color);
}

function updatePlayer() {
    if (isJumping) {
        playerYVelocity -= jumpForce;
        isJumping = false;
    }

    playerYVelocity += gravity;
    player.y += playerYVelocity;

    // Keep player on the ground
    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        playerYVelocity = 0;
    }
}

function generateRock() {
    if (Math.random() < 0.02) { // Adjust probability of rock generation
        rocks.push(new Rock());
    }
}

function updateRocks() {
    for (let i = rocks.length - 1; i >= 0; i--) {
        rocks[i].update();
        rocks[i].draw();

        // Remove rocks that are off-screen
        if (rocks[i].x + rocks[i].width < 0) {
            rocks.splice(i, 1);
        }
    }
}

function checkCollision() {
    for (let i = 0; i < rocks.length; i++) {
        if (
            player.x < rocks[i].x + rocks[i].width &&
            player.x + player.width > rocks[i].x &&
            player.y < rocks[i].y + rocks[i].height &&
            player.y + player.height > rocks[i].y
        ) {
            gameOver = true;
            clearInterval(gameLoopInterval);
            alert(`Game Over! Score: ${score}`);
        }
    }
}

function updateScore() {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    drawPlayer();
    generateRock();
    updateRocks();
    checkCollision();
    updateScore();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && player.y === canvas.height - player.height) {
        isJumping = true;
    }
});

// Game loop
function gameLoop() {
    if (!gameOver) {
        update();
    }
}

// Start the game
gameLoopInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
