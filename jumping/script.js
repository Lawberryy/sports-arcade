import Player from './Player.js'
import Obstacle from './Obstacle.js'

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth - 20;
ctx.canvas.height = 250;

if (window.innerWidth < 768) {
    canvas.width = window.innerHeight - 100;
    canvas.height = window.innerWidth - 100;
}

// Charger les images pour le joueur et les obstacles
let player = new Player(250, 250, 50, 50, 'playerImage.png'); // Remplacez 'playerImage.png' par l'URL de votre image
let obstacles = [];
let obstacleSpeed = 5;
let gameOver = false;
let gameStarted = false;
let startTime = null;
let timeSurvived = 0;
let playerWin = false;

function spawnObstacle() {
    const obstacle = new Obstacle(canvas.width, 150, 30, 120, obstacleSpeed, 'obstacleImage.png'); // Remplacez 'obstacleImage.png' par l'URL de votre image
    obstacles.push(obstacle);
}

function displayStartMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
    ctx.globalAlpha = 0.8;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = `bold 16px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Appuie sur Entrer pour commencer', canvas.width / 2, canvas.height / 2);
}

function startGame() {
    gameStarted = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loop();
}

function handleObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.update();
        obstacle.draw(ctx);
        if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width;
            obstacle.isOffScreen();
        }
    });
}

function checkCollision() {
    return obstacles.some(obstacle => {
        return (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        );
    });
}

function resetGame() {
    obstacles = [];
    obstacleSpeed = 5;
    timeSurvived = 0;
    gameOver = false;
    playerWin = false;
    startTime = Date.now();
    spawnObstacle();
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Distance traveled: ' + Math.floor(timeSurvived / 1000) + 'm', 120, 30);
}

function loop() {
    if (playerWin) {
        return;
    }
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = `bold 16px Arial`;
        ctx.fillText('Tu as perdu !', canvas.width / 2, canvas.height / 2);
        return;
    }

    if (timeSurvived >= 30000) {
        playerWin = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = `bold 16px Arial`;
        ctx.fillText('Tu as gagné !', canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white"; // Alterner les couleurs
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    handleObstacles();
    player.update();
    player.draw(ctx);

    const now = Date.now();
    timeSurvived = now - startTime;

    if (checkCollision()) {
        gameOver = true;
    }

    drawScore();

    requestAnimationFrame(loop);
}

spawnObstacle();
displayStartMessage();

window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        player.jump();
    }
});

window.addEventListener('keydown', function (e) {
    if (e.code === 'Enter') {
        if (!gameStarted) {
            gameStarted = true;
            startTime = Date.now();
            startGame();
        }

        if (gameOver || playerWin) {
            resetGame();
            startGame();
        }
    }
});

