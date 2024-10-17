export default class Player {
    constructor(x, y, radius, imageSrc) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx) {
        // Sauvegarder le contexte avant de clipper
        ctx.save();

        // Créer le cercle et restreindre le dessin à cette zone
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.clip();

        // Dessiner l'image à l'intérieur du cercle
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);

        // Restaurer le contexte après avoir dessiné
        ctx.restore();
    }

    move(mouseX) {
        this.x = mouseX;
    }
}
