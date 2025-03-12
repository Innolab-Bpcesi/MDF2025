const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Game variables
let player1Score = 0;
let player2Score = 0;

// Paddle
class Paddle {
  constructor(x, y, width, height, color, upKey, downKey) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = 5;
    this.upKey = upKey;
    this.downKey = downKey;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    // Keep paddle within canvas bounds
    this.y = Math.max(0, Math.min(this.y, CANVAS_HEIGHT - this.height));
  }
}

// Ball
class Ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed = 4;
    this.velocityX = this.speed;
    this.velocityY = this.speed;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Bounce off top and bottom walls
    if (this.y + this.radius > CANVAS_HEIGHT || this.y - this.radius < 0) {
      this.velocityY = -this.velocityY;
    }
  }
}

// Create paddles and ball
const player1Paddle = new Paddle(10, CANVAS_HEIGHT / 2 - 50, 10, 100, 'white', 'w', 's');
const player2Paddle = new Paddle(CANVAS_WIDTH - 20, CANVAS_HEIGHT / 2 - 50, 10, 100, 'white', 'ArrowUp', 'ArrowDown');
const ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 10, 'white');

// Handle key presses
const keys = {};
window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});
window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

// Update paddles based on key presses
function updatePaddles() {
  if (keys[player1Paddle.upKey] && player1Paddle.y > 0) {
    player1Paddle.y -= player1Paddle.speed;
  }
  if (keys[player1Paddle.downKey] && player1Paddle.y < CANVAS_HEIGHT - player1Paddle.height) {
    player1Paddle.y += player1Paddle.speed;
  }
  if (keys[player2Paddle.upKey] && player2Paddle.y > 0) {
    player2Paddle.y -= player2Paddle.speed;
  }
  if (keys[player2Paddle.downKey] && player2Paddle.y < CANVAS_HEIGHT - player2Paddle.height) {
    player2Paddle.y += player2Paddle.speed;
  }
}

// Check for collisions
function checkCollisions() {
  // Ball collision with paddles
  const paddleHit = (ball.x - ball.radius < player1Paddle.x + player1Paddle.width &&
    ball.y > player1Paddle.y &&
    ball.y < player1Paddle.y + player1Paddle.height) ||
    (ball.x + ball.radius > player2Paddle.x &&
      ball.y > player2Paddle.y &&
      ball.y < player2Paddle.y + player2Paddle.height);

  if (paddleHit) {
    ball.velocityX = -ball.velocityX;
  }

  // Ball out of bounds
  if (ball.x - ball.radius < 0) {
    player2Score++;
    resetBall();
  } else if (ball.x + ball.radius > CANVAS_WIDTH) {
    player1Score++;
    resetBall();
  }
}

// Reset ball position
function resetBall() {
  ball.x = CANVAS_WIDTH / 2;
  ball.y = CANVAS_HEIGHT / 2;
  ball.velocityX = -ball.velocityX; // Reverse direction
  updateScores();
}

// Update scores
function updateScores() {
  player1ScoreDisplay.textContent = `Player 1: ${player1Score}`;
  player2ScoreDisplay.textContent = `Player 2: ${player2Score}`;
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  updatePaddles();
  player1Paddle.update();
  player2Paddle.update();
  ball.update();
  checkCollisions();

  player1Paddle.draw();
  player2Paddle.draw();
  ball.draw();

  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
