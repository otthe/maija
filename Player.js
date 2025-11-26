import { odex, config } from "./game.js";

function pickPosition(pos, sw, sh) {
  const pad=16;
  switch(pos) {
    case 0:
      return {
        x: Math.floor(config.width/2-(sw/2)),
        y: Math.floor(config.height - (sh+pad))
      }
    case 1:
      return {
        x: Math.floor(0+pad),
        y: Math.floor(config.height/2 - (sh/2))
      }
    case 2:
      return {
        x: Math.floor(config.width/4-(sw/2)),
        y: Math.floor(0+pad)
      }
    case 3:
      const offset=config.width/4;
      return {
        x: Math.floor(config.width-offset-(sw/2)),
        y: Math.floor(0+pad)
      }
    case 4:

      return {
        x: Math.floor(config.width-(sw+pad)),
        y: Math.floor(config.height/2 - sh/2)
      }

    default:
      return {x: -32, y: -32};

  }

}

const slotWidth = 64;
const slotHeight = 96;

const cardWidth = 48;
const cardHeight = 64;

export default class Player {
  constructor(type, position) {
    this.type = type;
    this.position=position;
  
    const {x, y} = pickPosition(position,slotWidth, slotHeight);

    this.x = x;
    this.y = y;

    this.playerName = "Player " + (this.position+1);

    this.layer = odex.G.layers[1];

    this.hand = [];

    this.isVisible = false;
  }

  update(dt) {

  }

  render() {
    if (!this.isVisible) return;
    // if (gs.currentTurn===this.position) {
    //   this.layer.ctx.fillStyle ="blue";
    // } else {
    //   this.layer.ctx.fillStyle = "red";
    // }

    this.layer.ctx.fillStyle = "red";

    this.layer.ctx.fillRect(this.x, this.y, slotWidth, slotHeight);
 
    this.layer.ctx.fillStyle = "#fff";
    this.layer.ctx.fillText(this.playerName, this.x, this.y);
 
    /*if (this.type==="player") {
      const middle = Math.floor(this.x + slotWidth/2);
      const pad = 16;
      const totalCardsLength = this.hand.length*(pad+cardWidth);
      const sx = Math.floor(middle-(totalCardsLength/2));  
      
      for (let i = 0; i < this.hand.length; i++) {
        const c = this.hand[i];

        this.layer.ctx.fillStyle = "#fff";
        const cx = sx+(i*(pad+cardWidth));
        const cy = Math.floor(this.y-slotHeight/2);
        this.layer.ctx.fillRect(cx, cy, cardWidth, cardHeight);

        this.layer.ctx.fillStyle = "#000";
        this.layer.ctx.fillText(c.suit, cx, cy+16);
        this.layer.ctx.fillText(c.rank, cx, cy+32);
        this.layer.ctx.fillText(c.value, cx, cy+48);
      }
    }*/
  }
}