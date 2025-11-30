import { odex,config } from "./game.js";

export default class InfoBox {
  constructor(game,x,y,w,h) {
    this.game=game;
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.layer=odex.G.layers[2];
  }

  update(dt) {

  }

  render(){
    this.layer.ctx.fillStyle ="rgba(0,0,0,0.5)";
    this.layer.ctx.fillRect(this.x,this.y, this.w, this.h);

    this.layer.ctx.fillStyle="#fff";
    this.layer.ctx.fillText(this.game.infoMessage, Math.floor(this.x+(this.w/2)), this.y+16);

    if(this.game.winOrder.length>0) {
      for(let i = 0; i<this.game.winOrder.length; i++) {
        const ranking=this.game.winOrder[i];
        const str = `${i+1} sija: ${ranking.playerName}`;
        this.layer.ctx.fillText(str, Math.floor(this.x+(this.w/2)), (this.y+32)+(i*16));
      }
    }
  }
}