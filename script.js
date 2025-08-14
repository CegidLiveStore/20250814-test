// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Animation state
let animationId;
let isPaused = false;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
        this.gravity = 0.2;
        this.friction = 0.99;
        this.bounce = 0.8;
    }

    update() {
        // No gravity - balls bounce perpetually
        
        // No friction - balls keep moving forever
        
        // Update position
        this.x += this.dx;
        this.y += this.dy;
        
        // Bounce off walls
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.dx = -this.dx * this.bounce;
            this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        }
        
        if (this.y + this.radius >= canvas.height) {
            this.dy = -this.dy * this.bounce;
            this.y = canvas.height - this.radius;
        }
        
        // Bounce off ceiling
        if (this.y - this.radius <= 0) {
            this.dy = -this.dy * this.bounce;
            this.y = this.radius;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        // Add a subtle glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        ctx.shadowBlur = 0;
    }
}

// Create balls with different colors
const balls = [
    new Ball(100, 100, 20, '#FFFFFF'), // White ball
    new Ball(200, 150, 25, '#0066FF'), // Blue ball
    new Ball(300, 200, 30, '#FF0000'), // Red ball
    new Ball(400, 100, 22, '#FFFFFF'), // Another white ball
    new Ball(500, 250, 28, '#0066FF'), // Another blue ball
    new Ball(150, 300, 26, '#FF0000'), // Another red ball
    new Ball(250, 400, 24, '#00FF00'), // Green ball
    new Ball(600, 350, 27, '#00FF00'), // Another green ball
];

// Animation loop
function animate() {
    if (isPaused) return;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw balls
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });
    
    // Check for ball collisions
    checkCollisions();
    
    // Continue animation
    animationId = requestAnimationFrame(animate);
}

// Check for collisions between balls
function checkCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const ball1 = balls[i];
            const ball2 = balls[j];
            
            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ball1.radius + ball2.radius) {
                // Collision detected - simple elastic collision
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                
                // Rotate velocities
                const vx1 = ball1.dx * cos + ball1.dy * sin;
                const vy1 = ball1.dy * cos - ball1.dx * sin;
                const vx2 = ball2.dx * cos + ball2.dy * sin;
                const vy2 = ball2.dy * cos - ball2.dx * sin;
                
                // Swap velocities
                ball1.dx = vx2 * cos - vy1 * sin;
                ball1.dy = vy1 * cos + vx2 * sin;
                ball2.dx = vx1 * cos - vy2 * sin;
                ball2.dy = vy2 * cos + vx1 * sin;
                
                // Move balls apart to prevent sticking
                const overlap = (ball1.radius + ball2.radius - distance) / 2;
                const moveX = overlap * cos;
                const moveY = overlap * sin;
                
                ball1.x -= moveX;
                ball1.y -= moveY;
                ball2.x += moveX;
                ball2.y += moveY;
            }
        }
    }
}

// Control functions
function toggleAnimation() {
    isPaused = !isPaused;
    if (!isPaused) {
        animate();
    }
}

function resetBalls() {
    // Cancel current animation
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Reset ball positions and velocities
    balls.forEach((ball, index) => {
        ball.x = 100 + index * 100;
        ball.y = 100 + (index % 3) * 50;
        ball.dx = (Math.random() - 0.5) * 8;
        ball.dy = (Math.random() - 0.5) * 8;
    });
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restart animation
    isPaused = false;
    animate();
}

// Add some interactive features
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Add a new ball at click position
    const colors = ['#FFFFFF', '#0066FF', '#FF0000', '#00FF00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newBall = new Ball(x, y, 15 + Math.random() * 15, randomColor);
    balls.push(newBall);
    
    // Limit the number of balls
    if (balls.length > 15) {
        balls.shift();
    }
});

// Start the animation
animate();

// Add keyboard controls
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case ' ':
            event.preventDefault();
            toggleAnimation();
            break;
        case 'r':
        case 'R':
            resetBalls();
            break;
    }
});
