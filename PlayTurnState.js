import { botPlay } from "./BotPlay.js";
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

    if (player.hand.length === 0 && this.game.deck.length === 0) {
      this.turnOver=true;
    } else {
      if (player.type === "bot") {
        eq.emit({type: "WAIT", ms: 20});
        eq.emit({type: "BOT_PLAY", callback: (() => {        
          botPlay(this.game);
        })});
      }
    }

  }

  update(dt) {
    if (eq.isIdle() && !this.done && !this.turnOver) {

      // state progression rules
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