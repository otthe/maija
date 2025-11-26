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
  }

  update(dt) {
    // const a = {x:gameData.mouseX, y:gameData.mouseY, w:1, h:1};
    // const b = {x:this.x, y:this.y, w:this.w, h:this.h};
    // if (Collision.rect(a, b)) {
    //   this.selected=true;
    // }
    if (this.game.turnPlayer === 0) {
      this.active = true;
    } else {
      this.active = false;
      this.selected=false;
    }
  }
  
  // render(x,y,w,h) {
  //   this.layer.ctx.fillRect(x, y, w, h);

  //   this.layer.ctx.fillStyle = "#000";
  //   this.layer.ctx.fillText(this.suit, x, y+16);
  //   this.layer.ctx.fillText(this.rank, x, y+32);
  //   this.layer.ctx.fillText(this.value, x, y+48);
  // }

  render() {
    this.layer.ctx.fillStyle = "#fff";
    this.layer.ctx.fillRect(this.x, this.y, this.w, this.h);

    this.layer.ctx.fillStyle = "#000";
    this.layer.ctx.fillText(this.suit, this.x, this.y+16);
    this.layer.ctx.fillText(this.rank, this.x, this.y+32);
    this.layer.ctx.fillText(this.value, this.x, this.y+48);

    if (this.selected) {
      this.layer.ctx.strokeStyle = "blue";
      this.layer.ctx.lineWidth = 6;
      this.layer.ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
  }


}

