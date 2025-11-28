import { config, odex, sm } from "./game.js";

export class BeatArea {
  constructor(game,x,y,w,h){
    this.game=game;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.layer=odex.G.layers[2];
  }

  update(dt) {
    const middle = Math.floor(config.width/2);
    const pad = 16;
    const totalCardsLength = this.game.cardsToBeat.length*(pad+config.cardWidth);
    const sx = Math.floor(middle-(totalCardsLength/2));  

    for(let i=0; i < this.game.cardsToBeat.length; i++) {
      const c = this.game.cardsToBeat[i];
      const cx = sx+(i*(pad+config.cardWidth));
      const cy = Math.floor((this.y+this.h)-(c.h+16));

      c.x = cx;
      c.y = cy;

      c.update(dt);
    }
  }

  render() {
    if (this.game.cardsToBeat.length > 0 /*&& sm.current.constructor.name === "PlayTurnState"*/ ) {
      const w = config.width;
      this.layer.ctx.fillStyle = "rgba(0,0,0,0.7)";
      this.layer.ctx.fillRect(this.x, this.y, this.w, this.h);

      this.game.cardsToBeat.forEach((c) => {
        c.render();
      });

      if (this.game.dealedBy) {
        this.layer.ctx.fillStyle="#fff";
        const str = `${this.game.dealedBy.playerName} lyö pelaajalle ${this.game.players[this.game.turnPlayer].playerName}`;
        this.layer.ctx.fillText(str, this.x, this.y+16);
      }

    }
  }
}