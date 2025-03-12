const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const GRID_SIZE = 16;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Game variables
let score = 0;
let pacman;
let ghosts = [];
let cherry;
let isPowerUpActive = false;
let powerUpTimer = 0;

// Pacman
class Pacman {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = GRID_SIZE / 2 - 2;
        this.direction = 'right';
        this.speed = 2;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        if (this.direction === 'right') {
            this.x += this.speed;
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        } else if (this.direction === 'up') {
            this.y -= this.speed;
        } else if (this.direction === 'down') {
            this.y += this.speed;
        }
        // Keep Pacman within the canvas bounds
        this.x = Math.max(this.radius, Math.min(this.x, CANVAS_WIDTH - this.radius));
        this.y = Math.max(this.radius, Math.min(this.y, CANVAS_HEIGHT - this.radius));
    }
}

// Ghost
class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = GRID_SIZE / 2 - 2;
        this.direction = 'left';
        this.speed = 1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        if (this.direction === 'right') {
            this.x += this.speed;
            if (this.x > CANVAS_WIDTH - this.radius) this.direction = 'left';
        } else if (this.direction === 'left') {
            this.x -= this.speed;
            if (this.x < this.radius) this.direction = 'right';
        } else if (this.direction === 'up') {
            this.y -= this.speed;
            if (this.y < this.radius) this.direction = 'down';
        } else if (this.direction === 'down') {
            this.y += this.speed;
            if (this.y > CANVAS_HEIGHT - this.radius) this.direction = 'up';
        }
        this.changeDirection();
    }

    changeDirection(){
        const change = Math.random();
        if(change < 0.05){
            const newDirection = ['up', 'down', 'left', 'right'];
            this.direction = newDirection[Math.floor(Math.random() * newDirection.length)];
        }
    }
}

// Cherry (Power-Up)
class Cherry {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 6;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Initialize the game
function initializeGame() {
    pacman = new Pacman(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'yellow');
    ghosts.push(new Ghost(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4, 'red'));
    cherry = new Cherry(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);

    window.addEventListener('keydown', handleKeyDown);
    gameLoop();
}

// Handle key presses
function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            pacman.direction = 'up';
            break;
        case 'ArrowDown':
            pacman.direction = 'down';
            break;
        case 'ArrowLeft':
            pacman.direction = 'left';
            break;
        case 'ArrowRight':
            pacman.direction = 'right';
            break;
    }
}

// Update the score
function updateScore(amount) {
    score += amount;
    scoreDisplay.textContent = `Score: ${score}`;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    pacman.update();
    pacman.draw();

    for (let ghost of ghosts) {
        ghost.update();
        ghost.draw();
    }
    cherry.draw();

    checkCollisions();

    requestAnimationFrame(gameLoop);
}

//Check collisions
function checkCollisions(){
    //Cherry collision
    const distanceCherry = Math.sqrt((cherry.x - pacman.x) ** 2 + (cherry.y - pacman.y) ** 2);
    if (distanceCherry < pacman.radius + cherry.radius) {
        isPowerUpActive = true;
        powerUpTimer = 500; // 500 frames (about 8 seconds at 60fps)
        cherry.x = -100; // Move cherry off-screen
        cherry.y = -100;
    }

    //Ghost collision
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i];
        const distanceGhost = Math.sqrt((ghost.x - pacman.x) ** 2 + (ghost.y - pacman.y) ** 2);

        if (distanceGhost < pacman.radius + ghost.radius) {
            if (isPowerUpActive) {
                ghosts.splice(i, 1); // Remove the ghost
                updateScore(100);
            } else {
                // Game Over (for now, just reset)
                score = 0;
                updateScore(0);
                pacman.x = CANVAS_WIDTH / 2;
                pacman.y = CANVAS_HEIGHT / 2;
                ghosts = [];
                ghosts.push(new Ghost(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4, 'red'));
                cherry.x = CANVAS_WIDTH / 2;
                cherry.y = CANVAS_HEIGHT / 4;
            }
        }
    }

    // Power-up timer
    if (isPowerUpActive) {
        powerUpTimer--;
        if (powerUpTimer <= 0) {
            isPowerUpActive = false;
        }
    }
}

// Start the game
initializeGame();
