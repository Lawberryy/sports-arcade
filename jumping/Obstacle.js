export default class Obstacle {
    constructor(x, y, width, height, speed, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc; // Charger l'image de l'obstacle
    }

    draw(ctx) {
        // Dessiner l'image de l'obstacle
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
    }

    isOffScreen() {
        this.speed += 1;
    }
}
