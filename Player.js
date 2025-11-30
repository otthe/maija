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

    this.isPlaying=true;
  }

  update(dt) {

    if (this.type==="player") {
      const middle = Math.floor(this.x + config.slotWidth/2);
      const pad = 16;
      const totalCardsLength = this.hand.length*(pad+config.cardWidth);
      const sx = Math.floor(middle-(totalCardsLength/2));  
      
      for (let i = 0; i < this.hand.length; i++) {
        const c = this.hand[i];

        const cx = sx+(i*(pad+config.cardWidth));
        const cy = Math.floor(this.y-config.slotHeight/2);

        c.x = cx;
        c.y = cy;

        //player hand cards should not be selectable normal way if there is cards to beat for the given player, 
        //instead the same effect is achieved by using this.game.selectedCard for one-on-one comparison of hand card and beatable card
        //note that we do this inside player and card for a reason - hand cards belong to players and not cardsToBeat for example
        if (this.game.cardsToBeat.length > 0 && this.game.turnPlayer === 0) {
          c.selected = false;
        }
        
        c.update(dt);
      }
    }

  }

  render() {
    if (!this.isVisible) return;

    //this.layer.ctx.fillRect(this.x, this.y, config.slotWidth, config.slotHeight);
    // this.layer.ctx.drawImage(odex.getSprite("spritesheet"), 0, 96, 48, 64, this.x, this.y, config.slotWidth/2, config.slotHeight/2);
    
    if (this.type === "player") {
      // this.layer.ctx.drawImage(odex.getSprite("players"), 0, 0, 96, 128, this.x, this.y, config.slotWidth, config.slotHeight);
      this.layer.ctx.drawImage(odex.getSprite("player"), 0, 0, 384, 512, this.x, this.y, config.slotWidth, config.slotHeight);
    } else {
      // this.layer.ctx.drawImage(odex.getSprite("players"), 96, 0, 96, 128, this.x, this.y, config.slotWidth, config.slotHeight);
      this.layer.ctx.drawImage(odex.getSprite("player"), 0, 0, 384, 512, this.x, this.y, config.slotWidth, config.slotHeight);
    }



    if (this.game.turnPlayer===this.position) {
      this.layer.ctx.fillStyle ="orange";
    } else {
      this.layer.ctx.fillStyle = "#fff";
    }
    this.layer.ctx.fillText(this.playerName, this.x, this.y);
 
    if (this.type==="player" && this.isVisibleCards) {
      for (let i = 0; i < this.hand.length; i++) {
        const c = this.hand[i];
        c.render();
      }
    } else if (this.type === "bot" && this.isVisibleCards) {
      for (let i = 0; i < this.hand.length; i++) {
        const c = this.hand[i];
        c.botRender(this.x+i, (this.y+(config.slotHeight/2))+i);
        //c.render();
      }
    }

    this.layer.ctx.fillStyle="#fff";
    this.layer.ctx.fillText(`Kortit: ${this.hand.length}`, this.x, this.y+config.slotHeight-16);
  }
}