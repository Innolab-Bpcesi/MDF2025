const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
const jumpForce = -10;

// Player
const player = {
    x: 50,
    y: 100,
    width: 30,
    height: 30,
    color: 'red',
    velocityY: 0,
    isJumping: false,
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update: function() {
        this.velocityY += gravity;
        this.y += this.velocityY;

        // Keep player within the canvas
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    },
    jump: function() {
        if (!this.isJumping) {
            this.velocityY = jumpForce;
            this.isJumping = true;
        }
    }
};

// Platforms
const platforms = [
    { x: 0, y: canvas.height - 20, width: canvas.width, height: 20, color: 'green' }, // Ground
    { x: 150, y: 250, width: 100, height: 20, color: 'green' },
    { x: 350, y: 150, width: 100, height: 20, color: 'green' },
];

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Collision detection
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();

    // Platform collision
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }
    });

    drawPlatforms();
    player.draw();

    requestAnimationFrame(update);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        player.jump();
    }
    if (e.key === 'ArrowLeft') {
        player.x -= 5;
    }
    if (e.key === 'ArrowRight') {
        player.x += 5;
    }
});

update();
