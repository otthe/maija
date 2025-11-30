import { config, odex } from "./game.js";

export class DealAnimation {
  constructor(startX, startY, destX, destY, callback) {
    this.sx = startX;
    this.sy = startY;
    this.dx = destX;
    this.dy = destY;
    this.callback=callback;

    this.x = startX;
    this.y = startY;

    this.active = true;
    this.duration = 700;   // ms
    this.elapsed = 0;

    this.rotation = Math.round(Math.random()*360);       // radians
    this.spinSpeed = 0 //Math.PI * 2; // full rotation per second

    this.layer = odex.G.layers[1];
  }

  update(dt) {
    if (!this.active) return;

    this.elapsed += dt;

    const t = Math.min(this.elapsed / this.duration, 1);

    this.x = this.sx + (this.dx - this.sx) * t;
    this.y = this.sy + (this.dy - this.sy) * t;

    this.rotation += this.spinSpeed * dt;

    if (t >= 1) {
      this.callback();
      this.active = false;
    }
  }

  render() {
    if (!this.active) return;

    this.layer.ctx.save();

    this.layer.ctx.translate(this.x + config.cardWidth / 2, this.y + config.cardHeight / 2);
    this.layer.ctx.rotate(this.rotation);

    // this.layer.ctx.fillStyle = "white";
    // this.layer.ctx.fillRect(-config.cardWidth / 2, -config.cardHeight / 2, config.cardWidth, config.cardHeight);


    // this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 48, 0, 48, 64, -config.cardWidth / 2, -config.cardHeight / 2, config.cardWidth, config.cardHeight);

    this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 64, 0, 64, 96, -config.cardWidth / 2, -config.cardHeight / 2, config.cardWidth, config.cardHeight);


    this.layer.ctx.restore();
  }
}