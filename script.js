const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const lapDisplay = document.getElementById('lap');

// Kart properties
const kart = {
    x: 100,
    y: 100,
    width: 40,
    height: 20,
    color: 'red',
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.2,
    deceleration: 0.1,
    turnSpeed: 0.05,
    angle: 0, // In radians
    lap: 1,
    draw: function() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    },
    update: function() {
        // Update speed
        if (this.isAccelerating) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else {
            this.speed = Math.max(this.speed - this.deceleration, 0);
        }

        // Update angle
        if (this.isTurningLeft) {
            this.angle -= this.turnSpeed;
        }
        if (this.isTurningRight) {
            this.angle += this.turnSpeed;
        }

        // Update position based on speed and angle
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        // Check for track collision
        this.checkTrackCollision();
    },
    checkTrackCollision: function() {
        // Simple track collision (rectangle)
        if (this.x < 0 || this.x + this.width > canvas.width || this.y < 0 || this.y + this.height > canvas.height) {
            this.speed = 0;
            this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
            this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
        }
        // Check for finish line
        if (this.x > finishLine.x && this.x < finishLine.x + finishLine.width && this.y > finishLine.y && this.y < finishLine.y + finishLine.height && this.speed > 0) {
            this.lap++;
            lapDisplay.textContent = `Lap: ${this.lap}/3`;
            if (this.lap > 3) {
                endGame();
            }
        }
    },
    isAccelerating: false,
    isTurningLeft: false,
    isTurningRight: false,
};

// Track properties
const track = {
    color: '#008000',
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
};

// Finish line
const finishLine = {
    x: 700,
    y: 0,
    width: 10,
    height: 100,
    color: 'white',
    draw: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    track.draw();
    finishLine.draw();
    kart.update();
    kart.draw();

    requestAnimationFrame(update);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            kart.isAccelerating = true;
            break;
        case 'ArrowLeft':
            kart.isTurningLeft = true;
            break;
        case 'ArrowRight':
            kart.isTurningRight = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            kart.isAccelerating = false;
            break;
        case 'ArrowLeft':
            kart.isTurningLeft = false;
            break;
        case 'ArrowRight':
            kart.isTurningRight = false;
            break;
    }
});

function endGame() {
    message.textContent = "You win!";
}

update();
