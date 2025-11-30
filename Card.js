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

    this.isBeatable = false;
  }

  update(dt) {
    if (this.game.turnPlayer === 0) {
      this.active = true;
    } else {
      this.active = false;
      this.selected=false;
    }

    //adjust variables depending on if its beatable or in a hand
    if (this.game.cardsToBeat.includes(this)) {
      this.layer = odex.G.layers[2];
      this.selected=false;
      this.isBeatable=true;
    } else {
      this.layer = odex.G.layers[1];
      this.isBeatable=false;
    }
  }
  
  render() {
   
    if (this.isVisible) {

      //this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 0, 0, 48, 64, this.x, this.y, config.cardWidth, config.cardHeight);
      this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 0, 0, 64, 96, this.x, this.y, config.cardWidth, config.cardHeight);

      this.layer.ctx.fillStyle = "#000";
      this.layer.ctx.fillText(this.suit, this.x, this.y+16);
      this.layer.ctx.fillText(this.rank, this.x, this.y+32);
      this.layer.ctx.fillText(this.value, this.x, this.y+48);
    }

    if (this.selected || this.game.selectedCard === this || this.game.selectedRival === this) {
      this.layer.ctx.strokeStyle = "orange";
      this.layer.ctx.lineWidth = 6;
      this.layer.ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
  }

  //normal render for players and this to render wrong-sided stack for bots
  botRender(bx,by) {
    if (this.isVisible) {

      // this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 48, 0, 48, 64, bx, by, config.cardWidth, config.cardHeight);

      this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 64, 0, 64, 96, bx, by, 64, 96);

      // this.layer.ctx.fillStyle = "#000";
      // this.layer.ctx.fillText(this.suit, bx, by+16);
      // this.layer.ctx.fillText(this.rank, bx, by+32);
      // this.layer.ctx.fillText(this.value, bx, by+48);
    }
  }


}

