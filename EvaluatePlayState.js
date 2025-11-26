import { DealCardState } from "./DealCardState.js";
import { eq, config, odex } from "./game.js";
import { PlayTurnState } from "./PlayTurnState.js";
import { State } from "./State.js";

export class EvaluatePlayState extends State {
  constructor(game) {
    super();
    this.game=game;
    this.done = false;
  }

  enter() {
    console.log("[EvaluatePlayState]");
  }

  update(dt) {
    if (eq.isIdle() && !this.done) {
      // eq.emit({ type: "WAIT", ms: 100 });
      eq.emit({type: "SEND_MESSAGE", msg: "Evaluate cards played"});
      // state progression rules...
      this.done=true;
    }
  }

  isFinished(){
    return this.done;
  }

  nextState() {
    //return new PlayTurnState(this.game, this.game.turnPlayer);
    return new DealCardState(this.game, false);
  }

  exit() {
    
  }
}