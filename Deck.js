import { odex, config } from "./game.js"

export class Deck {
  constructor(game) {
    this.game=game;
    this.layer = odex.G.layers[1];
    this.x = Math.floor(config.width/2);
    this.y = Math.floor(config.height/2);
  
  }


  update(dt){
  }

  render() {
    this.layer.ctx.fillStyle = "red";
    this.layer.ctx.fillRect(this.x-(config.cardWidth/2), this.y-(config.cardHeight/2), config.cardWidth, config.cardHeight);
    // for (let i  =0; i < this.game.deck.length; i++) {
    //   this.layer.ctx.fillRect(this.x-(config.cardWidth/2)+i, this.y-(config.cardHeight/2)+i, config.cardWidth, config.cardHeight);
    // }
  }
}