import { eq, config, odex } from "./game.js";
import { State } from "./State.js";
import { PlayTurnState } from "./PlayTurnState.js";
import Player from "./Player.js";
import { DealAnimation } from "./DealAnimation.js";
import { CardUtil } from "./CardUtil.js";
import { Card } from "./Card.js";
import { PickTrumpCardState } from "./PickTrumpCardState.js";

function dealInitialCards(players, deck, game ) {
  let fulfilled = [];

  let queuedAnimations = [];
  while(fulfilled.length < players.length && deck.length > 0) {
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (!fulfilled.includes(p.position) && deck.length > 0) {
        //animations.push(new DealAnimation(Math.floor(config.width/2), Math.floor(config.height/2), p.x , p.y));
        const card = CardUtil.draw(deck)

        queuedAnimations.push({
          sx: Math.floor(config.width/2),
          sy: Math.floor(config.height/2),
          dx: p.x,
          dy: p.y,
          card: card
        });

        //p.hand.push(card);
        p.hand.push(new Card(
          game,
          card.rank,
          card.suit,
          card.value,
          p.x,
          p.y,
        ));
        if (p.hand.length >= 5 || deck.length<= 0) {
          fulfilled.push(p.position);
        }
      }
    }
  }
  return queuedAnimations;
}

export class DealCardState extends State {
  constructor(game, initialDeal=false) {
    super();
    this.game = game;
    this.done = false;

    this.initialDeal = initialDeal;
  
    this.queuedAnimations = null;
  }

  enter() {
    console.log("[DealCardState]");
    if (this.initialDeal) {
      this.queuedAnimations = dealInitialCards(this.game.players, this.game.deck, this.game);
      console.log(this.game.players);
      console.log(this.game.animations);
    }
  }
  update(dt) {
    if (eq.isIdle() && !this.done) {
      //eq.emit({ type: "WAIT", ms: 200 });

      // deal five cards to all players if initial

      if (this.initialDeal) {
        if (this.queuedAnimations && this.queuedAnimations.length > 0) {
          const animation = this.queuedAnimations.shift();
          eq.emit({ type: "WAIT", ms: config.dealCardDelay}); //50
          eq.emit({type: "DEAL_CARD", animation: animation});
        } else {
          this.done = true;
        }
      }else {
        //check if last player has less than five cards
        this.done = true;
      }
    }
  }

  exit() {
    if (this.initialDeal) {
      this.game.players[0].isVisibleCards = true;
    }
  }

  isFinished(){
    return this.done;
  }

  nextState() {
    //return new PlayTurnState(this.game, this.game.turnPlayer);
    if (this.initialDeal) {
      return new PickTrumpCardState(this.game, this.game.turnPlayer);
    }
    return new PlayTurnState(this.game, this.game.turnPlayer);
  }

}