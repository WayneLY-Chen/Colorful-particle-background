
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particlesCount = 120;
const connectionDistance = 150;
const mouseRadius = 200;
const particleBaseSize = 2;
const repelForce = 0.05;

const colors = [
    '#ff5722',
    '#4caf50',
    '#2196f3',
    '#9c27b0',
    '#e91e63',
    '#ffeb3b',
    '#00bcd4'
];

let particles = [];
let mouse = {
    x: null,
    y: null
};

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + particleBaseSize;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalColor = this.color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                
                this.x += Math.cos(angle) * force * 5;
                this.y += Math.sin(angle) * force * 5;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < particlesCount; i++) {
        particles.push(new Particle());
    }
}

function connect() {
    for (let i = 0; i < particles.length; i++) {
        if (mouse.x !== null && mouse.y !== null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseRadius) {
                ctx.strokeStyle = particles[i].color;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 1 - (dist / mouseRadius);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                ctx.strokeStyle = particles[i].color;
                ctx.lineWidth = 0.8;
                ctx.globalAlpha = 1 - (dist / connectionDistance);
                
                ctx.shadowBlur = 3;
                ctx.shadowColor = particles[i].color;
                
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                
            }
        }
    }
    ctx.globalAlpha = 1;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const particle of particles) {
        particle.update();
        particle.draw();
    }
    
    connect();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    initCanvas();
    createParticles();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

initCanvas();
createParticles();
animate();
