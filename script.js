const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Player
class Player {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.jumpPower = -12;
    this.isJumping = false;
    this.isOnGround = false;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    // Apply gravity
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    this.x += this.velocityX;

    // Keep player within canvas bounds (horizontally)
    this.x = Math.max(0, Math.min(this.x, CANVAS_WIDTH - this.width));

    // Check if player is on the ground or a platform
    this.isOnGround = false;
    for (let platform of platforms) {
      if (this.checkCollision(platform)) {
        this.isOnGround = true;
        this.y = platform.y - this.height; // Place player on top of platform
        this.velocityY = 0; // Stop falling
      }
    }

    // Check if player falls off the bottom
    if (this.y > CANVAS_HEIGHT) {
      gameOver();
    }
  }

  jump() {
    if (this.isOnGround) {
      this.velocityY = this.jumpPower;
      this.isJumping = true;
      this.isOnGround = false;
    }
  }

  checkCollision(platform) {
    return (
      this.x < platform.x + platform.width &&
      this.x + this.width > platform.x &&
      this.y < platform.y + platform.height &&
      this.y + this.height > platform.y
    );
  }
}

// Platform
class Platform {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Create player and platforms
const player = new Player(50, 50, 30, 30, 'red');
const platforms = [
  new Platform(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20, 'green'), // Ground
  new Platform(150, 400, 150, 20, 'green'),
  new Platform(400, 300, 150, 20, 'green'),
  new Platform(200, 200, 150, 20, 'green'),
  new Platform(600, 150, 150, 20, 'green'),
];
const endPoint = new Platform(700, 100, 50, 50, 'blue');

// Handle key presses
const keys = {};
window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
  if (event.key === ' ') {
    player.jump();
  }
});
window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

// Update player movement based on key presses
function updatePlayerMovement() {
  player.velocityX = 0; // Reset horizontal speed
  if (keys['ArrowLeft']) {
    player.velocityX = -5;
  }
  if (keys['ArrowRight']) {
    player.velocityX = 5;
  }
}

// Game over
function gameOver() {
  alert('Game Over!');
  // Reset the game (for now, just reload the page)
  location.reload();
}

// Check win condition
function checkWin() {
  if (player.checkCollision(endPoint)) {
    alert('You Win!');
    location.reload();
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  updatePlayerMovement();
  player.update();
  player.draw();

  for (let platform of platforms) {
    platform.draw();
  }
  endPoint.draw();

  checkWin();

  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
