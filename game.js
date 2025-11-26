import { Collision } from './Collision.js';
import { DealAnimation } from './DealAnimation.js';
import { EventQueue } from './EventQueue.js';
import Odex from './odex.js';
import { StartGameState } from './StartGameState.js';
import { StateMachine } from './StateMachine.js';

export const config = {
  width: 960,
  height: 640,
  cardWidth: 64, //48
  cardHeight: 96, //64
  slotWidth: 64,
  slotHeight: 96,
}

export const odex = new Odex(config.width, config.height);

const sprites = [];
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
  DEAL_CARD: (ev) => {
    actuallyDealCard(ev.player);
  },

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
    gameData.animations.push(new DealAnimation(ev.animation.sx, ev.animation.sy, ev.animation.dx, ev.animation.dy));
    //console.log(gameData.animations.length);
  },

  SEND_MESSAGE: (ev) => {
    console.log(ev.msg);
  }
  
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
  clicked: false
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
}

function getCanvasMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(event.clientX - rect.left),
    y: Math.floor(event.clientY - rect.top),
  };
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
      gameData.turnPlayer = (gameData.turnPlayer + 1) % gameData.players.length;
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

    if (gameData.turnPlayer === 0) {
      const player = gameData.players[0];

      for (let i = 0; i < player.hand.length; i++) {
        const c = player.hand[i];

        const a = {x:gameData.mouseX, y:gameData.mouseY, w:1, h:1};
        const b = {x:c.x, y:c.y, w:c.w, h:c.h};
      
        if (Collision.rect(a, b)) {
          c.selected = !c.selected;
        }
      }
    }


  
    console.log(`→ Click at (${gameData.mouseX}, ${gameData.mouseY})`);
  });
});
