import { config, odex } from "./game.js";

const cardWidth = 48;
const cardHeight = 64;
export class DealAnimation {
  constructor(startX, startY, destX, destY) {
    this.sx = startX;
    this.sy = startY;
    this.dx = destX;
    this.dy = destY;

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
      this.active = false;
    }
  }

  render() {
    if (!this.active) return;

    this.layer.ctx.save();

    this.layer.ctx.translate(this.x + cardWidth / 2, this.y + cardHeight / 2);
    this.layer.ctx.rotate(this.rotation);

    this.layer.ctx.fillStyle = "white";
    this.layer.ctx.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);

    this.layer.ctx.restore();
  }
}