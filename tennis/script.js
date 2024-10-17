import Player from "./Player.js";
import Ball from "./Ball.js";

const player1Image = new Image();
player1Image.src = 'player1-image.png';  // Remplacez par le chemin réel de l'image du joueur 1

const player2Image = new Image();
player2Image.src = 'player2-image.jpeg';  // Remplacez par le chemin réel de l'image du joueur 2

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

const player1 = new Player(0, canvas.height / 2 - 50, 10, 100, canvas.height);
const player2 = new Player(canvas.width - 10, canvas.height / 2 - 50, 10, 100, canvas.height);
const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, canvas.width, canvas.height);

let gameStarted = false;
let countdownActive = false;
let countdown = 3;
let message = '';
let displayMessage = false;
const initialBallSpeed = 5;
const winningScore = 7;

function drawTennisCourt() {
    // Fond du terrain de tennis
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lignes blanches du terrain
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;

    // Ligne de fond (bas et haut)
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Ligne du filet (centre)
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 20);
    ctx.lineTo(canvas.width / 2, canvas.height - 20);
    ctx.stroke();
}

function drawNet() {
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
}

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';

    // Score du joueur 1
    ctx.drawImage(player1Image, canvas.width / 4 - 50, 10, 40, 40);  // Image du joueur 1
    ctx.fillText(player1.score, canvas.width / 4, 50);  // Score du joueur 1

    // Score du joueur 2
    ctx.drawImage(player2Image, 3 * canvas.width / 4 - 50, 10, 40, 40);  // Image du joueur 2
    ctx.fillText(player2.score, 3 * canvas.width / 4, 50);  // Score du joueur 2
}

function drawMessage(text) {
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
    ctx.globalAlpha = 0.8;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Appuyez sur Entrer pour commencer', canvas.width / 2, canvas.height / 2);
}

function drawCountdown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTennisCourt();
    drawNet();
    drawScore();
    player1.draw(ctx);
    player2.draw(ctx);
    ctx.font = '60px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 0;
    ball.speedY = 0;
}

function startCountdown() {
    countdownActive = true;
    countdown = 3;
    const interval = setInterval(() => {
        if (countdown > 0) {
            drawCountdown();
            countdown--;
        } else {
            countdownActive = false;
            gameStarted = true;
            ball.speedX = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
            ball.speedY = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
            clearInterval(interval);
            update();
        }
    }, 1000);
}

function checkWinner() {
    if (player1.score >= winningScore || player2.score >= winningScore) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        gameStarted = false;
        const winner = player1.score >= winningScore ? 'Joueur 1' : 'Joueur 2';
        drawMessage(`${winner} a gagné !`);
        return true;
    }
    return false;
}

function displayPointMessage(scoringPlayer) {
    gameStarted = false;
    message = scoringPlayer === 'player1' ? 'Joueur 1 a marqué !' : 'Joueur 2 a marqué !';
    displayMessage = true;

    setTimeout(() => {
        displayMessage = false;
        if (!checkWinner()) {
            startCountdown();
        }
    }, 2000);
}

function update() {
    if (!gameStarted || countdownActive) return;

    player1.move();
    player2.move();
    ball.move();

    ball.checkCollision(player1);
    ball.checkCollision(player2);

    if (ball.x - ball.radius < 0) {
        player2.score++;
        resetBall();
        displayPointMessage('player2');
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        resetBall();
        displayPointMessage('player1');
    }

    // Redessiner le jeu
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTennisCourt();
    drawNet();
    drawScore();
    player1.draw(ctx);
    player2.draw(ctx);

    // Dessiner la balle comme un cercle blanc
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    if (displayMessage) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawMessage(message);
    }

    if (!displayMessage) {
        requestAnimationFrame(update);
    }
}

function handleKeydown(event) {
    if (!gameStarted && event.key === 'Enter' && !countdownActive && player1.score < winningScore && player2.score < winningScore) {
        startCountdown();
    }

    if (gameStarted && !countdownActive) {
        switch (event.key) {
            case 'z':
                player1.dy = -player1.speed;
                break;
            case 's':
                player1.dy = player1.speed;
                break;
            case 'ArrowUp':
                player2.dy = -player2.speed;
                break;
            case 'ArrowDown':
                player2.dy = player2.speed;
                break;
        }
    }
}

function handleKeyup(event) {
    if (gameStarted && !countdownActive) {
        switch (event.key) {
            case 'z':
            case 's':
                player1.dy = 0;
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                player2.dy = 0;
                break;
        }
    }
}

window.addEventListener('keydown', handleKeydown);
window.addEventListener('keyup', handleKeyup);

drawStartScreen();
