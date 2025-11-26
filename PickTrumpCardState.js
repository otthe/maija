import { eq, config, odex } from "./game.js";
import { PlayTurnState } from "./PlayTurnState.js";
import { State } from "./State.js";

export class PickTrumpCardState extends State {
  constructor(game) {
    super();
    this.game=game;
    this.done = false;
  }

  enter() {
    console.log("[PickTrumpCardState]");
  }

  update(dt) {
    if (eq.isIdle() && !this.done) {
      // eq.emit({ type: "WAIT", ms: 100 });
      eq.emit({type: "SEND_MESSAGE", msg: "pick the trump card from deck"});
      eq.emit({type: "PICK_TRUMP_CARD"});

      // state progression rules...
      this.done=true;
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