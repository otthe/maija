import { EvaluatePlayState } from "./EvaluatePlayState.js";
import { eq, config, odex } from "./game.js";
import { Maija } from "./Maija.js";
import { State } from "./State.js";

export class PlayTurnState extends State {
  constructor(game,playerId) {
    super();
    this.game = game;
    this.playerId=playerId;
    this.done = false;
    this.turnOver = false;
  }

  enter() {
    console.log("[PlayTurnState]");
    const player = this.game.players[this.game.turnPlayer];
    const nextPlayer = this.game.players[(this.game.turnPlayer + 1) % this.game.players.length];
    if (player.type === "bot") {
      eq.emit({type: "WAIT", ms: 20});
      eq.emit({type: "BOT_PLAY", callback: (() => {
        
        if (player.type === "bot") {
          if (this.game.cardsToBeat.length > 0 ) {
            Maija.raiseCards(this.game, player, this.game.cardsToBeat);
          } else {
            if (player.hand.length > 0) {
              player.hand[0].selected = true;
              const selectedCards = player.hand.filter((card) => card.selected);
              Maija.dealCards(this.game, player, nextPlayer, selectedCards);
            }  
          }
        }
      
      })});
    }
  }

  update(dt) {
    if (eq.isIdle() && !this.done && !this.turnOver) {
      //eq.emit({ type: "WAIT", ms: 500 });
      eq.emit({type: "SEND_MESSAGE", msg: "Do the plays!"});
      
      // const player = this.game.players[this.game.turnPlayer];
      // const nextPlayer = this.game.players[(this.game.turnPlayer + 1) % this.game.players.length];
      // if (player.type === "bot") {
      //   if (this.game.cardsToBeat.length > 0 ) {
      //     Maija.raiseCards(this.game, player, this.game.cardsToBeat);
      //   } else {
      //     if (player.hand.length > 0) {
      //       player.hand[0].selected = true;
      //       const selectedCards = player.hand.filter((card) => card.selected);
      //       Maija.dealCards(this.game, player, nextPlayer, selectedCards);
      //     }  
      //   }
      // }
      
      // state progression rules..
      if (this.game.turnPlayer !== this.playerId) {
        console.log("ja vaihtuu!");
        this.turnOver=true;
      }

      if (this.turnOver) this.done=true;
    }
  }

  isFinished(){
    return this.done;
  }

  nextState() {
    return new EvaluatePlayState(this.game);
  }

  exit() {
    this.game.selectedCard = null;
    this.game.selectedRival = null;
  }

}