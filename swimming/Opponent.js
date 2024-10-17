export default class Opponent {
    constructor(x, y, radius, speed, imageSrc) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
        this.imageLoaded = false;

        this.image.onload = () => {
            this.imageLoaded = true;
        };

        this.allers = 0;
        this.direction = 1;
        this.reachedEdge = false;
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            ctx.restore();
        } else {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update() {
        this.x += this.speed * this.direction;
    }

    reverse() {
        this.allers += 1;
        this.direction *= -1;
        this.reachedEdge = true;
    }

    resetEdgeFlag() {
        this.reachedEdge = false;
    }
}
