import Player from './Player.js';
import Opponent from './Opponent.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 100;
canvas.height = 200;

if (window.innerWidth < 768) {
    canvas.width = window.innerHeight - 100;
    canvas.height = 300;
}

let player;
let opponent;
let lastKeyPressed = null;
let nombreAllers = 2;
let gameOver = false;
let gameStarted = false;

// Fonction pour dessiner le fond bleu avec un quadrillage blanc
function drawPoolBackground() {
    // Fond bleu clair
    ctx.fillStyle = '#ADD8E6'; // Couleur bleu clair
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quadrillage blanc
    ctx.strokeStyle = 'white'; // Couleur des lignes du quadrillage
    ctx.lineWidth = 1; // Épaisseur des lignes

    const gridSize = 40; // Taille de chaque carreau du quadrillage

    // Dessiner les lignes verticales du quadrillage
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Dessiner les lignes horizontales du quadrillage
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Fonction pour dessiner la ligne horizontale rouge et blanche au centre
function drawCenterLine() {
    const middleY = canvas.height / 2; // Position verticale au milieu du canvas
    const lineThickness = 4; // Épaisseur de la ligne

    // Dessiner la ligne rouge
    ctx.strokeStyle = 'red';
    ctx.lineWidth = lineThickness;
    ctx.beginPath();
    ctx.moveTo(0, middleY);
    ctx.lineTo(canvas.width, middleY);
    ctx.stroke();

    // Dessiner la ligne blanche au-dessus de la ligne rouge
    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineThickness;
    ctx.beginPath();
    ctx.setLineDash([15, 15]); // Créer un effet de pointillé (rouge-blanc)
    ctx.moveTo(0, middleY);
    ctx.lineTo(canvas.width, middleY);
    ctx.stroke();
    ctx.setLineDash([]); // Réinitialiser les tirets
}

function displayStartMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
    ctx.globalAlpha = 0.8;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white'
    ctx.font = `bold 16px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Appuie sur Entrer pour commencer', canvas.width / 2, canvas.height / 2);
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Alterne Fléche Gauche et Flèche Droite pour avancer', canvas.width / 2, canvas.height / 2 + 30);
}

function startGame() {
    gameStarted = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameLoop();
}

function displayEndScreen(message) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#8A8EF1"; // Alterner les couleurs
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold 16px Arial`;
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    gameOver = true;
    gameStarted = false;
}

function resetGame() {
    player = new Player(50, canvas.height / 2 - 50, 30, 'playerImage.png');
    opponent = new Opponent(50, canvas.height / 2 + 50, 30, 3.5, 'opponentImage.png');
    lastKeyPressed = null;
    gameOver = false;
}

function gameLoop() {
    if (gameOver || !gameStarted) return;

    // Dessiner le fond de piscine
    drawPoolBackground();

    // Dessiner la ligne rouge et blanche au centre
    drawCenterLine();

    if (player.allers >= nombreAllers) {
        displayEndScreen('Tu as gagné !');
        return;
    }
    if (opponent.allers >= nombreAllers) {
        displayEndScreen('Trop lent ! Tu as perdu');
        return;
    }

    player.draw(ctx);
    opponent.draw(ctx);
    opponent.update();

    if ((player.x + player.radius > canvas.width || player.x - player.radius < 0) && !player.reachedEdge) {
        player.reverse();
    }
    if (player.x - player.radius > 0 && player.x + player.radius < canvas.width) {
        player.resetEdgeFlag();
    }

    if ((opponent.x + opponent.radius > canvas.width || opponent.x - opponent.radius < 0) && !opponent.reachedEdge) {
        opponent.reverse();
    }
    if (opponent.x - opponent.radius > 0 && opponent.x + opponent.radius < canvas.width) {
        opponent.resetEdgeFlag();
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' && !gameStarted) {
        resetGame();
        startGame();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (e.key !== lastKeyPressed) {
            player.update();
            lastKeyPressed = e.key;
        }
    }
});

displayStartMessage();
