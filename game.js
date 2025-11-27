import { Card } from './Card.js';
import { CardUtil } from './CardUtil.js';
import { Collision } from './Collision.js';
import { DealAnimation } from './DealAnimation.js';
import DealButton from './DealButton.js';
import { EventQueue } from './EventQueue.js';
import Odex from './odex.js';
import { StartGameState } from './StartGameState.js';
import { StateMachine } from './StateMachine.js';

export const config = {
  width: 960,
  height: 640,
  cardWidth: 64, //48
  cardHeight: 96, //64
  slotWidth: 96,
  slotHeight: 128,
  dealCardDelay: 1, //50
}

export const odex = new Odex(config.width, config.height);

const sprites = [
  {name: "spritesheet", src: '/art/spritesheet.png'},
  {name: "players", src: '/art/players.png'}
];
const sounds = [];

const gameContainer = document.getElementById('gameContainer');
const bot = document.getElementById('bot'); 
bot.style.touchAction = "none";
const mid = document.getElementById('mid'); 
mid.style.touchAction = "none";
const top = document.getElementById('top');    
top.style.touchAction = "none";

export const sm = new StateMachine();
export const eq = new EventQueue();

const eventHandlers = {
  PLAY_CARD: (ev) => {
    handlePlayCard(ev.player, ev.card);
  },

  WAIT: (ev) => {
    // WAIT logic is handled internally
  },

  SPAWN_PLAYER: (ev) => {
    const p = gameData.players[ev.id];
    p.isVisible = true;
  },

  DEAL_CARD: (ev) => {
    const rank = ev.animation.card.rank;
    const suit = ev.animation.card.suit;
    gameData.animations.push(new DealAnimation(ev.animation.sx, ev.animation.sy, ev.animation.dx, ev.animation.dy, () => setCardVisibleCallback(rank, suit)));
    //console.log(gameData.animations.length);
  },

  SEND_MESSAGE: (ev) => {
    console.log(ev.msg);
  },

  PICK_TRUMP_CARD: (ev) => {

  },
  
};

const gameData = {
  deck: [],
  players: [],
  table: [],
  scores: {},
  round: 0,
  turnPlayer: null,
  //pot: 0,
  //etc: {}
  botObjects: [],
  midObjects: [],
  topObjects: [],
  animations: [],

  mouseX: 0,
  mouseY: 0,
  clicked: false,

  cardsToBeat: [],
  trumpCardPicked: false,
};


function updateBot(layer, dt) {
  for (let i = 0; i < layer.objects.length; i++) {
    const o = layer.objects[i];
    o.update(dt);
  }
}

function updateMid(layer, dt) {
  for (let i = 0; i < layer.objects.length; i++) {
    const o = layer.objects[i];
    o.update(dt);
  }

  for(let i=0; i< gameData.players.length; i++) {
    const p = gameData.players[i];
    p.update(dt);
  }
}

function updateTop(layer, dt) {
  for (let i = 0; i < layer.objects.length; i++) {
    const o = layer.objects[i];
    o.update(dt);
  }

  let animations = gameData.animations;
  animations = animations.filter(animation => animation.active);
  animations.forEach((animation) => {
    animation.update(dt);
  });

  gameData.dealButton.update(dt);

}

function renderBot(layer) {
  odex.clear(layer.ctx);

  for (let i = 0; i < layer.objects.length; i++) {
    const o = layer.objects[i];
    o.render();
  }
}

function renderMid(layer) {
  odex.clear(layer.ctx);

  for (let i = 0; i < layer.objects.length; i++) {
    const o = layer.objects[i];
    o.render();
  }

  for (let i = 0; i < gameData.players.length; i++) {
    const p = gameData.players[i];
    p.render();
  }
} 

function renderTop(layer) {
  odex.clear(layer.ctx);

  for (let i = 0; i < layer.objects.length; i++) {
    const o = layer.objects[i];
    o.render();
  }

  let animations = gameData.animations;
  animations.forEach((animation) => {
    animation.render();
  });

  gameData.dealButton.render();
}

function getCanvasMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(event.clientX - rect.left),
    y: Math.floor(event.clientY - rect.top),
  };
}

function setCardVisibleCallback(rank, suit) {
  for (let i = 0; i < gameData.players.length; i++) {
    const p = gameData.players[i];
    for (let j = 0; j < p.hand.length; j++) {
      const c = p.hand[j];

      if (c.rank === rank && c.suit === suit) {
        c.isVisible = true;
        return;
      }
    }
  }
  console.log("shoul never go here, right?");
}

function nextTurn() {
  return gameData.turnPlayer = (gameData.turnPlayer + 1) % gameData.players.length;
}

document.addEventListener("DOMContentLoaded", async function() {
  await odex.init(sprites, sounds);

  odex.addLayer('#bot');
  odex.addLayer('#mid');
  odex.addLayer('#top');

  odex.G.layers.forEach((layer) => {
    const l = layer.layer;
    const scale= 1;
    l.width = config.width;
    l.height = config.height;
    l.style.width = `${Math.floor(config.width * scale)}px`;
    l.style.height = `${Math.floor(config.height * scale)}px`;
  });

  odex.loop();

  sm.change(new StartGameState(gameData));

  // update(dt):
  //  stateMachine.update(dt)    ← high-level logic (what should happen now)
  //  eventQueue.update(dt)      ← timed actions (when things happen)
  //  gameObjects.update(dt)     ← movement, animations, physics
  //  render()                   ← draw everything

  console.log(odex.getSprite("spritesheet"));

  odex.G.layers[0].ctx.font = "16px Arial";
  odex.G.layers[1].ctx.font = "16px Arial";
  odex.G.layers[2].ctx.font = "16px Arial";

  odex.update((layers, deltaTime) => {

    deltaTime = deltaTime*1000;
    sm.update(deltaTime);
    eq.update(deltaTime, eventHandlers);

    updateBot(layers[0], deltaTime);
    updateMid(layers[1], deltaTime);
    updateTop(layers[2], deltaTime);
  });

  odex.render((layers) => {
    if (document.hidden) return;

    renderBot(layers[0]);
    renderMid(layers[1]);
    renderTop(layers[2]);

    layers[2].ctx.fillStyle = "#fff";
    layers[2].ctx.fillText(sm.current.constructor.name, 32,32);

  });

  document.addEventListener("keyup", function(e) {
    if (e.code === "Space" && sm.current.constructor.name === "PlayTurnState") {
      //switch turn
      //gameData.turnPlayer = (gameData.turnPlayer + 1) % gameData.players.length;
      nextTurn();
    }
  });

  // hover listener
  mid.addEventListener("pointermove", (e) => {
    const pos = getCanvasMousePos(mid, e);
    gameData.mouseX = pos.x;
    gameData.mouseY = pos.y;
  });
  
  // click listener
  mid.addEventListener("click", (e) => {
    const pos = getCanvasMousePos(mid, e);
    gameData.mouseX = pos.x;
    gameData.mouseY = pos.y;
    gameData.clicked = true;

    //players turn
    if (gameData.turnPlayer === 0) {
      const player = gameData.players[0];
      const nextPlayer = gameData.players[(gameData.turnPlayer + 1) % gameData.players.length];
      const selectedCards = player.hand.filter((card) => card.selected);
      const mouseRect = {x:gameData.mouseX, y:gameData.mouseY, w:1, h:1};

      //is it colliding with player cards
      for (let i = 0; i < player.hand.length; i++) {
        const c = player.hand[i];

        const cardRect = {x:c.x, y:c.y, w:c.w, h:c.h};
      
        if (Collision.rect(mouseRect, cardRect) && c.isVisible) {
          c.selected = !c.selected;
          return;
        }
      }

      //if player is about to deal
      const dealButton = gameData.dealButton;
      const dealButtonRect = {x: dealButton.x, y: dealButton.y, w: dealButton.w, h: dealButton.h};
      if (dealButton && dealButton.active && Collision.rect(mouseRect, dealButtonRect)) {
        if (selectedCards.length > 0) {
          player.hand = player.hand.filter((card) => !card.selected);
         // gameData.cardsToBeat = selectedCards;

          selectedCards.forEach((card) => {
            const animation = {
              sx: card.x,
              sy: card.y,
              dx: nextPlayer.x,
              dy: nextPlayer.y,
              card: card
            }

            console.log(animation);

            eq.emit({type: "WAIT", ms: config.dealCardDelay});
            eq.emit({type: "DEAL_CARD", animation: animation });
          });

          while (player.hand.length < 5 && gameData.deck.length > 0 ){
            const card = CardUtil.draw(gameData.deck);
            player.hand.push(new Card(
              player.game,
              card.rank,
              card.suit,
              card.value,
              player.x,
              player.y
            ));

            const animation = {
              sx: Math.floor(config.width/2),
              sy: Math.floor(config.height/2),
              dx: player.x,
              dy: player.y,
              card: card
            }

            eq.emit({type: "WAIT", ms: config.dealCardDelay});
            eq.emit({type: "DEAL_CARD", animation: animation });
          }

          //nextTurn();
        } else {
          eq.emit({ type: "SEND_MESSAGE", msg: "You need to select cards!"});
        }
      }

      //if player is about to raise
    }

    console.log(`Click at (${gameData.mouseX}, ${gameData.mouseY})`);
  });
});