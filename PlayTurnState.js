import { EvaluatePlayState } from "./EvaluatePlayState.js";
import { eq, config, odex } from "./game.js";
import { State } from "./State.js";

export class PlayTurnState extends State {
  constructor() {
    super();
    this.done = false;
    this.spawned=0;
  }

  enter() {
    console.log("[PlayTurnState]");
  }

  update(dt) {
    if (eq.isIdle() && !this.done) {
      eq.emit({ type: "WAIT", ms: 500 });
      eq.emit({type: "SEND_MESSAGE", msg: "Do the plays!"});
      // state progression rules..

      this.spawned++;
      if (this.spawned>=4) this.done=true;
    }
  }

  isFinished(){
    return this.done;
  }

  nextState() {
    return new EvaluatePlayState();
  }

  exit() {
    
  }

}