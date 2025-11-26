import { CardUtil } from "./CardUtil.js";
import { eq, config, odex } from "./game.js";
import { PlayTurnState } from "./PlayTurnState.js";
import { State } from "./State.js";

export class PickTrumpCardState extends State {
  constructor(game) {
    super();
    this.game=game;
    this.done = false;
    this.trumpCard = null;
  }

  enter() {
    console.log("[PickTrumpCardState]");

    this.trumpCard = CardUtil.draw(this.game.deck);
    console.log(this.trumpCard);
    this.game.deck.push(this.trumpCard);
  }

  update(dt) {
    if (eq.isIdle() && !this.done) {
      // eq.emit({ type: "WAIT", ms: 100 });
      eq.emit({type: "SEND_MESSAGE", msg: "pick the trump card from deck"});
      eq.emit({type: "PICK_TRUMP_CARD"});

      // state progression rules...
      if (this.trumpCard) {
        this.done=true;
        this.game.trumpCardPicked = true;
      }
    }
  }

  isFinished(){
    return this.done;
  }

  nextState() {
    return new PlayTurnState(this.game, this.game.turnPlayer);
  }

  exit() {
    
  }
}