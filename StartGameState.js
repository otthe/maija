import { eq, config, odex } from "./game.js";
import { State } from "./State.js";
import { PlayTurnState } from "./PlayTurnState.js";
import Player from "./Player.js";
import { CardUtil } from "./CardUtil.js";
import { DealCardState } from "./DealCardState.js";
import { Deck } from "./Deck.js";
import DealButton from "./DealButton.js";

function addPlayers(amount=5, game) {
  let players = [];
  for (let i = 0; i < amount; i++) {
    let type = "bot"
    if (i === 0) type = "player";
    players.push(new Player(type, i, game));
  }
  return players;
}

export class StartGameState extends State {
  constructor(game) {
    super();
    this.game = game;
    this.done = false;

    this.playerAmount = 5;
    this.spawnedPlayerIndex = 0;
  }

  enter() {
    console.log("[StartGameState]");
    this.game.deck = CardUtil.shuffle(CardUtil.createDeck());
    this.game.players = addPlayers(this.playerAmount, this.game);

    this.game.table = [];
    this.game.round = 1;
    this.game.turnPlayer = 0;

    this.game.botObjects = odex.G.layers[0].objects;
    this.game.midObjects = odex.G.layers[1].objects;
    this.game.topObjects = odex.G.layers[2].objects;
    this.game.animations = [];

    this.game.trumpCardPicked=false;
    this.game.cardsToBeat=[];

    this.game.midObjects.push(new Deck(this.game));
    this.game.dealButton=new DealButton(this.game, config.width-96, config.height-64, 96, 64);
    console.log(this.game.midObjects);
    console.log(odex.G.layers[1].objects);
  }

  update(dt) {
    if (eq.isIdle() && !this.done) {
      eq.emit({ type: "WAIT", ms: 50 }); //200
      eq.emit({type: "SPAWN_PLAYER", id: this.spawnedPlayerIndex});

      this.spawnedPlayerIndex++;
      if (this.spawnedPlayerIndex >= this.playerAmount) {
        this.done = true;
      }

    }
  }

  exit() {

  }

  isFinished(){
    return this.done;
  }

  nextState() {
    return new DealCardState(this.game, true);
  }

}