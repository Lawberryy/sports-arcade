export default class Player {
    constructor(x, y, width, height, canvasHeight) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvasHeight = canvasHeight;
        this.score = 0;
        this.speed = 10;
        this.dy = 0;
    }

    move() {
        this.y += this.dy;
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > this.canvasHeight) {
            this.y = this.canvasHeight - this.height;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    resetPosition() {
        this.y = this.canvasHeight / 2 - this.height / 2;
    }
}
