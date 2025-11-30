import { odex, config } from "./game.js";

export default class RaiseButton {
  constructor(game,x, y, w, h){
    this.game=game;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;

    this.active = false;
    this.layer=odex.G.layers[2];
  }

  update(dt) {
    if (this.game.turnPlayer === 0 && this.game.cardsToBeat.length > 0) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  render() {
    if (this.active) {
      const player = this.game.players[0];
      // this.layer.ctx.fillStyle = "brown";
      
      // this.layer.ctx.fillRect(this.x, this.y, this.w, this.h);
      this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 96, 112, 96, 64, this.x, this.y, this.w, this.h);

      this.layer.ctx.fillStyle = "#000";
      this.layer.ctx.fillText(`Nosta ${this.game.cardsToBeat.length} korttia`,Math.floor(this.x+(this.w/2)), Math.floor(this.y+(this.h/2)));
    }
  }
}