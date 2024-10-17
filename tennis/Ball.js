export default class Ball {
    constructor(x, y, radius, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.speedX = 5;
        this.speedY = 5;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Collision avec le haut et le bas du canvas
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvasHeight) {
            this.speedY *= -1;
        }
    }

    checkCollision(player) {
        if (this.x - this.radius < player.x + player.width &&
            this.x + this.radius > player.x &&
            this.y > player.y &&
            this.y < player.y + player.height) {
            this.speedX *= -1.1; // Inverser la direction et accélérer la balle
        }
    }

    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight / 2;
        this.speedX = 5 * (Math.random() > 0.5 ? 1 : -1); // Redémarrer dans une direction aléatoire
        this.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
