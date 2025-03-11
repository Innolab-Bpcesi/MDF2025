const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const car = {
  x: canvas.width / 2 - 20,
  y: canvas.height / 2 - 30,
  width: 40,
  height: 60,
  speed: 5,
  color: 'red'
};

const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function drawCar() {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

function update() {
  if (keys['ArrowUp']) {
    car.y -= car.speed;
  }
  if (keys['ArrowDown']) {
    car.y += car.speed;
  }
  if (keys['ArrowLeft']) {
    car.x -= car.speed;
  }
  if (keys['ArrowRight']) {
    car.x += car.speed;
  }

    // Prevent the car from going off-screen
    if (car.x < 0) car.x = 0;
    if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
    if (car.y < 0) car.y = 0;
    if (car.y + car.height > canvas.height) car.y = canvas.height - car.height;
  
  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar();
}

update();
