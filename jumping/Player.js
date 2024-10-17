export default class Player {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dy = 0;
        this.gravity = 1;
        this.jumpHeight = -20;
        this.grounded = false;
        this.image = new Image();
        this.image.src = imageSrc; // Charger l'image du joueur
    }

    draw(ctx) {
        // Dessiner l'image du joueur
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        if (!this.grounded) {
            this.dy += this.gravity;
            this.y += this.dy;
        }

        if (this.y + this.height >= 250) {
            this.y = 250 - this.height;
            this.grounded = true;
            this.dy = 0;
        } else {
            this.grounded = false;
        }
    }

    jump() {
        if (this.grounded) {
            this.dy = this.jumpHeight;
            this.grounded = false;
        }
    }
}
