import { eq, config, odex } from "./game.js";
import { PlayTurnState } from "./PlayTurnState.js";
import { State } from "./State.js";

export class EvaluatePlayState extends State {
  constructor() {
    super();
    this.done = false;

    this.spawned = 0;
  }

  enter() {
    console.log("[EvaluatePlayState]");
  }

  update(dt) {
    if (eq.isIdle() && !this.done) {
      eq.emit({ type: "WAIT", ms: 500 });
      eq.emit({type: "SEND_MESSAGE", msg: "Evaluate cards played"});
      // state progression rules...
      this.spawned++;
      if (this.spawned>=4) this.done=true;
    }
  }

  isFinished(){
    return this.done;
  }

  nextState() {
    return new PlayTurnState();
  }

  exit() {
    
  }
}