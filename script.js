/**
 * 多彩粒子連線背景實作
 * 基於 Canvas API 與 Vanilla JavaScript
 */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// 設定常量
let particlesCount = 120; // 粒子數量：100-150 個
const connectionDistance = 150; // 連線觸發距離
const mouseRadius = 200; // 滑鼠影響半徑
const particleBaseSize = 2; // 粒子基礎大小
const repelForce = 0.05; // 排斥力強度

// 顏色池：根據用戶提供的圖片挑選的多種鮮艷顏色
const colors = [
    '#ff5722', // 亮橘 (Orange)
    '#4caf50', // 鮮綠 (Green)
    '#2196f3', // 天藍 (Blue)
    '#9c27b0', // 紫色 (Purple)
    '#e91e63', // 亮粉 (Pink)
    '#ffeb3b', // 鮮黃 (Yellow)
    '#00bcd4'  // 青色 (Cyan)
];

let particles = [];
let mouse = {
    x: null,
    y: null
};

/**
 * 初始化網頁與 Canvas 大小
 */
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * 粒子類別 (Particle Class)
 */
class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5; // 隨機 X 速度
        this.vy = (Math.random() - 0.5) * 1.5; // 隨機 Y 速度
        this.radius = Math.random() * 2 + particleBaseSize; // 粒子半徑
        this.color = colors[Math.floor(Math.random() * colors.length)]; // 隨機色調
        this.originalColor = this.color;
    }

    /**
     * 更新粒子位置與狀態
     */
    update() {
        // 隨機移動
        this.x += this.vx;
        this.y += this.vy;

        // 碰到邊框反彈
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // 滑鼠排斥 (Repel Interaction)
        if (mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseRadius) {
                // 計算排斥力
                const force = (mouseRadius - distance) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                
                this.x += Math.cos(angle) * force * 5;
                this.y += Math.sin(angle) * force * 5;
            }
        }
    }

    /**
     * 繪製粒子
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // 微妙的發光 (Glow) 效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // 重置 shadow 以免影響效能
        ctx.shadowBlur = 0;
    }
}

/**
 * 建立粒子數列
 */
function createParticles() {
    particles = [];
    for (let i = 0; i < particlesCount; i++) {
        particles.push(new Particle());
    }
}

/**
 * 繪製粒子間與滑鼠的連線邏輯
 */
function connect() {
    for (let i = 0; i < particles.length; i++) {
        // 繪製粒子與滑鼠之間的連線
        if (mouse.x !== null && mouse.y !== null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseRadius) {
                ctx.strokeStyle = particles[i].color;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 1 - (dist / mouseRadius); // 距離隨遠變淡
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        // 繪製粒子彼此之間的連線 (O(N^2) 檢查)
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                // 使用其中一個粒子的顏色作為連線色，並帶有距離透明度
                ctx.strokeStyle = particles[i].color;
                ctx.lineWidth = 0.8;
                ctx.globalAlpha = 1 - (dist / connectionDistance);
                
                // 連線微妙發光
                ctx.shadowBlur = 3;
                ctx.shadowColor = particles[i].color;
                
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                
                ctx.shadowBlur = 0;
            }
        }
    }
    ctx.globalAlpha = 1; // 重置全局透明度
}

/**
 * 動畫疊代流程 (Animation Loop)
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const particle of particles) {
        particle.update();
        particle.draw();
    }
    
    connect();
    requestAnimationFrame(animate);
}

// 監聽器與初始化
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

// 開始
initCanvas();
createParticles();
animate();
