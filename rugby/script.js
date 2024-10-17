import Player from './Player.js';
import Obstacle from './Obstacle.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let player = new Player(canvas.width / 2, canvas.height - 70, 30, 'playerImage.png');
let obstacles = [];
let gameOver = false;
let gameStarted = false;
let timeSurvived = 0;
let playerWin = false;
let speedMin = 2;
let speedMax = 5;
let obstacleSpawnRate = 0.04;
let startTime = null;
let mousePosition = canvas.width / 2;

function increaseDifficulty() {
    setInterval(() => {
        if (!gameOver && !playerWin) {
            obstacleSpawnRate += 0.001;
        }
    }, 1000);
}

// Fonction pour dessiner les bandes verticales alternées
function drawVerticalStripes() {
    const stripeWidth = 50; // Largeur de chaque bande
    const colors = ['#3E832F', '#2B5E20']; // Les couleurs alternées

    for (let x = 0; x < canvas.width; x += stripeWidth) {
        ctx.fillStyle = colors[(x / stripeWidth) % 2]; // Alterner les couleurs
        ctx.fillRect(x, 0, stripeWidth, canvas.height);
    }
}

// Fonction pour dessiner les lignes horizontales
function drawHorizontalLines() {
    const lineCount = 3; // Nombre de lignes
    const lineThickness = 3; // Épaisseur des lignes
    const lineSpacing = canvas.height / (lineCount + 1); // Espacement vertical entre les lignes

    ctx.strokeStyle = 'white'; // Couleur des lignes
    ctx.lineWidth = lineThickness;

    for (let i = 1; i <= lineCount; i++) {
        const y = lineSpacing * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function checkCollision() {
    return obstacles.some(obstacle => {
        const dx = player.x - obstacle.x;
        const dy = player.y - obstacle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < player.radius + obstacle.radius;
    });
}

function keepPlayerInBounds() {
    if (player.x - player.radius < 0) {
        player.x = player.radius;
    } else if (player.x + player.radius > canvas.width) {
        player.x = canvas.width - player.radius;
    }
}

function displayStartMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#8A8EF1";
    ctx.globalAlpha = 0.8;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = 'white';
    ctx.font = `bold 16px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Appuie sur Entrer pour commencer', canvas.width / 2, canvas.height / 2);
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Déplace ton personnage avec la souris pour esquiver', canvas.width / 2, canvas.height / 2 + 30);
}

function startGame() {
    gameStarted = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameLoop();
}

function spawnObstacle() {
    const radius = Math.random() * (40 - 20) + 20;
    const speed = Math.random() * (speedMax - speedMin) + speedMin;
    const obstacle = new Obstacle(Math.random() * canvas.width, -radius, radius, speed, 'obstacleImage.png');
    obstacles.push(obstacle);
}

function handleObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.draw(ctx);

        if (obstacle.isOffScreen(canvas.height)) {
            obstacles.splice(index, 1);
        }
    });
}

function gameLoop() {
    if (playerWin) return;

    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#8A8EF1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = `bold 16px Arial`;
        ctx.fillText("Tu t'es fait plaquer ! Appuie sur Entrer pour recommencer", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Dessiner le fond avec bandes et lignes
    drawVerticalStripes();
    drawHorizontalLines();

    player.draw(ctx);
    handleObstacles();

    if (Math.random() < obstacleSpawnRate) {
        spawnObstacle();
    }

    if (checkCollision()) {
        gameStarted = false;
        gameOver = true;
    }

    const now = Date.now();
    timeSurvived = now - startTime;

    if (timeSurvived >= 30000) {
        playerWin = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = `bold 16px Arial`;
        ctx.fillText('Tu as gagné ! Appuie sur Entrer pour recommencer', canvas.width / 2, canvas.height / 2);
        return;
    }

    drawScore();
    player.move(mousePosition);
    keepPlayerInBounds();

    requestAnimationFrame(gameLoop);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Temps survécu : ' + Math.floor(timeSurvived / 1000) + 's', 80, 20);
}

window.addEventListener('keydown', function (e) {
    if (e.code === 'Enter' && !gameStarted) {
        gameOver = false;
        playerWin = false;
        obstacles = [];
        obstacleSpawnRate = 0.04;
        startTime = Date.now();
        increaseDifficulty();
        startGame();
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (!gameOver && !playerWin) {
        mousePosition = e.offsetX;
    }
});

displayStartMessage();
