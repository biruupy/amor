const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = window.innerWidth < 600 ? 1000 : 2000;
const mouse = { x: null, y: null, radius: window.innerWidth < 600 ? 30 : 50 };

function heartShape(t, scale) {
    return {
        x: scale * 16 * Math.pow(Math.sin(t), 3),
        y: -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    };
}

function createParticles() {
    const heartParticles = [];
    let scale = window.innerWidth < 600 ? 10 : 20;
    
    for (let i = 0; i < numParticles; i++) {
        let t = Math.random() * Math.PI * 2;
        let pos = heartShape(t, scale);
        let jitterX = (Math.random() - 0.5) * scale * 4;
        let jitterY = (Math.random() - 0.5) * scale * 4;

        heartParticles.push({
            x: canvas.width / 2 + pos.x + jitterX,
            y: canvas.height / 2 + pos.y + jitterY,
            baseX: canvas.width / 2 + pos.x + jitterX,
            baseY: canvas.height / 2 + pos.y + jitterY,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.5
        });
    }

    particles.push(...heartParticles);
}

function updateParticles() {
    for (let p of particles) {
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius - distance) / mouse.radius;
            let moveX = Math.cos(angle) * force * 30;
            let moveY = Math.sin(angle) * force * 30;

            p.x -= moveX;
            p.y -= moveY;
        } else {
            let distanceToBaseX = p.baseX - p.x;
            let distanceToBaseY = p.baseY - p.y;
            p.x += distanceToBaseX * 0.05;
            p.y += distanceToBaseY * 0.05;
            p.x = p.baseX + Math.sin(performance.now() * 0.005 + p.baseX) * 2;
            p.y = p.baseY + Math.cos(performance.now() * 0.005 + p.baseY) * 2;
        }
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    drawLetterM();
}

function drawLetterM() {
    ctx.font = `${window.innerWidth < 600 ? 40 : 80}px Arial`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M", canvas.width / 2, canvas.height / 2 - 20);
}

function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    createParticles();
});

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("touchmove", (aevent) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

createParticles();
animate();
