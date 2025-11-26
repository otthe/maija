import { EvaluatePlayState } from "./EvaluatePlayState.js";
import { eq, config, odex } from "./game.js";
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
  }

  update(dt) {
    if (eq.isIdle() && !this.done && !this.turnOver) {
      eq.emit({ type: "WAIT", ms: 500 });
      eq.emit({type: "SEND_MESSAGE", msg: "Do the plays!"});
      // state progression rules..

      if (this.game.turnPlayer !== this.playerId) {
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
    
  }

}