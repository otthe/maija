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
    if (this.game.trumpCardPicked && this.game.deck.length > 0) {
      this.layer.ctx.fillStyle = "#fff";
      this.layer.ctx.fillRect(this.x-(config.cardWidth/2)-16, this.y-(config.cardHeight/2)-64, config.cardWidth, config.cardHeight);
      this.layer.ctx.fillStyle = "#000";
      const lastCard = this.game.deck[this.game.deck.length-1];
      const str = `${lastCard.suit} - ${lastCard.value}`;
      this.layer.ctx.fillText(str, this.x-(config.cardWidth/2), this.y-(config.cardHeight/2)-32);
    }

    this.layer.ctx.fillStyle = "red";
    this.layer.ctx.fillRect(this.x-(config.cardWidth/2), this.y-(config.cardHeight/2), config.cardWidth, config.cardHeight);

    this.layer.ctx.fillStyle = "#000";
    this.layer.ctx.fillText(`${this.game.deck.length} cards`,this.x-(config.cardWidth/2), this.y-(config.cardHeight/2)+32 );
    // for (let i  =0; i < this.game.deck.length; i++) {
    //   this.layer.ctx.fillRect(this.x-(config.cardWidth/2)+i, this.y-(config.cardHeight/2)+i, config.cardWidth, config.cardHeight);
    // }
  }
}