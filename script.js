const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Game variables
let snake = [{ x: 10, y: 10 }];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let gameSpeed = 100; // Initial game speed (milliseconds per frame)

// Generate food
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
    y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
  };
  // Check if food spawns inside the snake
  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      generateFood();
      return;
    }
  }
}

// Draw a block
function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// Draw the snake
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    drawBlock(snake[i].x, snake[i].y, i === 0 ? 'green' : 'lime');
  }
}

// Draw the food
function drawFood() {
  drawBlock(food.x, food.y, 'red');
}

// Move the snake
function moveSnake() {
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

  // Check for collisions
  if (checkCollision(head)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    generateFood();
    increaseGameSpeed();
  } else {
    snake.pop();
  }
}

// Check for collisions
function checkCollision(head) {
  // Wall collision
  if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE || head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
    return true;
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Update the score
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Increase game speed
function increaseGameSpeed() {
  if (gameSpeed > 20) {
    gameSpeed -= 5; // Increase speed by decreasing the delay
  }
}

// Handle key presses
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
  }
});

// Game over
function gameOverFunc() {
  alert('Game Over! Score: ' + score);
  // Reset the game (for now, just reload the page)
  location.reload();
}

// Game loop
function gameLoop() {
  if (gameOver) {
    gameOverFunc();
    return;
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  moveSnake();
  drawSnake();
  drawFood();

  setTimeout(gameLoop, gameSpeed);
}

// Start the game
generateFood();
gameLoop();
