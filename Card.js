import { Collision } from "./Collision.js";
import { config, odex } from "./game.js";

export class Card {
  constructor(game, rank, suit, value, x, y) {
    this.game=game;
    this.rank=rank;
    this.suit=suit;
    this.value=value;
    this.x=x;
    this.y=y;
    this.w=config.cardWidth;
    this.h=config.cardHeight;

    this.layer = odex.G.layers[1];

    this.selected = false;
  
    this.active = false;

    this.isVisible = false;
  }

  update(dt) {
    if (this.game.turnPlayer === 0) {
      this.active = true;
    } else {
      this.active = false;
      this.selected=false;
    }
  }
  
  render() {
   
    if (this.isVisible) {

      this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 0, 0, 48, 64, this.x, this.y, config.cardWidth, config.cardHeight);

      this.layer.ctx.fillStyle = "#000";
      this.layer.ctx.fillText(this.suit, this.x, this.y+16);
      this.layer.ctx.fillText(this.rank, this.x, this.y+32);
      this.layer.ctx.fillText(this.value, this.x, this.y+48);
    }

    if (this.selected) {
      this.layer.ctx.strokeStyle = "orange";
      this.layer.ctx.lineWidth = 6;
      this.layer.ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
  }


}

