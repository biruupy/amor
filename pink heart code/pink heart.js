const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = window.innerWidth < 600 ? 1000 : 2000; // Reduz a quantidade no celular
const mouse = { x: null, y: null, radius: window.innerWidth < 600 ? 30 : 50 }; // Ajusta o raio no celular

// Função para calcular pontos do coração
function heartShape(t, scale) {
    return {
        x: scale * 16 * Math.pow(Math.sin(t), 3),
        y: -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    };
}

// Função para desenhar a letra M
function letterMShape(scale) {
    const points = [
        { x: -10, y: 10 },
        { x: 0, y: -20 },
        { x: 10, y: 10 },
        { x: 20, y: 10 },
        { x: 30, y: -20 },
        { x: 40, y: 10 }
    ];

    return points.map(p => ({
        x: p.x * scale,
        y: p.y * scale
    }));
}

// Criação das partículas com efeito de vibração e espalhamento natural
function createParticles() {
    const heartParticles = [];
    const letterMParticles = [];
    
    let scale = window.innerWidth < 600 ? 10 : 20; // Ajusta o tamanho no celular
    
    // Gerando partículas para o coração
    for (let i = 0; i < numParticles * 0.8; i++) { // 80% das partículas para o coração
        let t = Math.random() * Math.PI * 2;
        let pos = heartShape(t, scale);

        // Espalhamento leve
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

    // Gerando partículas para a letra M
    const mPoints = letterMShape(scale);
    for (let i = 0; i < numParticles * 0.2; i++) { // 20% das partículas para a letra M
        let point = mPoints[Math.floor(Math.random() * mPoints.length)];
        let jitterX = (Math.random() - 0.5) * 5;
        let jitterY = (Math.random() - 0.5) * 5;

        letterMParticles.push({
            x: canvas.width / 2 + point.x + jitterX,
            y: canvas.height / 2 + point.y + jitterY,
            baseX: canvas.width / 2 + point.x + jitterX,
            baseY: canvas.height / 2 + point.y + jitterY,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.5
        });
    }

    particles.push(...heartParticles, ...letterMParticles);
}

// Atualiza partículas com efeito de movimento e explosão
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
            // Movimento suave de volta ao local original
            let distanceToBaseX = p.baseX - p.x;
            let distanceToBaseY = p.baseY - p.y;
            p.x += distanceToBaseX * 0.05;
            p.y += distanceToBaseY * 0.05;

            // Vibração mais rápida e natural
            p.x = p.baseX + Math.sin(performance.now() * 0.005 + p.baseX) * 2;
            p.y = p.baseY + Math.cos(performance.now() * 0.005 + p.baseY) * 2;
        }
    }
}

// Desenha partículas
function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Animação
function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

// Ajusta tamanho ao redimensionar a tela
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    createParticles();
});

// Detecta movimento do mouse e toque na tela
window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Suporte para toque na tela
window.addEventListener("touchmove", (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

// Inicia o efeito
createParticles();
animate();
