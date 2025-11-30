import { config, eq, odex } from "./game.js";
import { State } from "./State.js";

export class GameOverState extends State {
  constructor(game) {
    this.game=game;
  }

  enter() {
    console.log("[EvaluatePlayState]");
  }

  update(dt) {
    if (eq.isIdle() && !this.done) {
      // eq.emit({ type: "WAIT", ms: 100 });
      eq.emit({type: "SEND_MESSAGE", msg: "Peli päättyi!"});
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