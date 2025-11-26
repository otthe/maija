import { Card } from "./Card.js";
import { CardUtil } from "./CardUtil.js";
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

export default class Player {
  constructor(type, position, game) {
    this.type = type;
    this.position=position;
    this.game = game;
  
    const {x, y} = pickPosition(position,config.slotWidth, config.slotHeight);

    this.x = x;
    this.y = y;

    this.playerName = "Player " + (this.position+1);

    this.layer = odex.G.layers[1];

    this.hand = [];

    this.isVisible = false;

    this.isVisibleCards = false;
  }

  update(dt) {

    if (this.type==="player") {
      const middle = Math.floor(this.x + config.slotWidth/2);
      const pad = 16;
      const totalCardsLength = this.hand.length*(pad+config.cardWidth);
      const sx = Math.floor(middle-(totalCardsLength/2));  
      
      for (let i = 0; i < this.hand.length; i++) {
        const c = this.hand[i];

        this.layer.ctx.fillStyle = "#fff";
        const cx = sx+(i*(pad+config.cardWidth));
        const cy = Math.floor(this.y-config.slotHeight/2);

        c.x = cx;
        c.y = cy;

        c.update(dt);
      }
    }

    // (new Card(
    //   game,
    //   card.rank,
    //   card.suit,
    //   card.value,
    //   p.x,
    //   p.y,
    // ))

    // while(this.hand.length < 5 && this.game.deck.length > 0) {
    //   const card = CardUtil.draw(this.game.deck);
    //   this.hand.push(
    //     new Card(
    //       this.game,
    //       card.rank,
    //       card.suit,
    //       card.value,
    //       this.x, 
    //       this.y,
    //     ) 
    //   );
    // }
  }

  render() {
    if (!this.isVisible) return;
    if (this.game.turnPlayer===this.position) {
      this.layer.ctx.fillStyle ="blue";
    } else {
      this.layer.ctx.fillStyle = "red";
    }


    this.layer.ctx.fillRect(this.x, this.y, config.slotWidth, config.slotHeight);
 
    this.layer.ctx.fillStyle = "#fff";
    this.layer.ctx.fillText(this.playerName, this.x, this.y);
 
    // if (this.type==="player" && this.isVisibleCards) {
    //   const middle = Math.floor(this.x + config.slotWidth/2);
    //   const pad = 16;
    //   const totalCardsLength = this.hand.length*(pad+config.cardWidth);
    //   const sx = Math.floor(middle-(totalCardsLength/2));  
      
    //   for (let i = 0; i < this.hand.length; i++) {
    //     const c = this.hand[i];

    //     this.layer.ctx.fillStyle = "#fff";
    //     const cx = sx+(i*(pad+config.cardWidth));
    //     const cy = Math.floor(this.y-config.slotHeight/2);
    //     this.layer.ctx.fillRect(cx, cy, config.cardWidth, config.cardHeight);

    //     this.layer.ctx.fillStyle = "#000";
    //     this.layer.ctx.fillText(c.suit, cx, cy+16);
    //     this.layer.ctx.fillText(c.rank, cx, cy+32);
    //     this.layer.ctx.fillText(c.value, cx, cy+48);
    //   }
    // }

    if (this.type==="player" && this.isVisibleCards) {
      // const middle = Math.floor(this.x + config.slotWidth/2);
      // const pad = 16;
      // const totalCardsLength = this.hand.length*(pad+config.cardWidth);
      // const sx = Math.floor(middle-(totalCardsLength/2));  
      
      for (let i = 0; i < this.hand.length; i++) {
        const c = this.hand[i];

        // this.layer.ctx.fillStyle = "#fff";
        // const cx = sx+(i*(pad+config.cardWidth));
        // const cy = Math.floor(this.y-config.slotHeight/2);
        //c.render(cx, cy, config.cardWidth, config.cardHeight);
        c.render();
      }
    }
  }
}