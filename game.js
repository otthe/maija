/* Copyright 2025- @ www.github.com/otthe */

import { Card } from './Card.js';
import { CardUtil } from './CardUtil.js';
import { Collision } from './Collision.js';
import { DealAnimation } from './DealAnimation.js';
import DealButton from './DealButton.js';
import { EventQueue } from './EventQueue.js';
import { Maija } from './Maija.js';
import Odex from './odex.js';
import { StartGameState } from './StartGameState.js';
import { StateMachine } from './StateMachine.js';


export function debug() {
  //https://stackoverflow.com/questions/1340872/how-to-get-javascript-caller-function-line-number-and-caller-source-url
  function getErrorObject(){
    try { throw Error('') } catch(err) { return err; }
  }
  var err = getErrorObject();
  var caller_line = err.stack.split("\n")[4];
  var index = caller_line.indexOf("at ");
  var clean = caller_line.slice(index+2, caller_line.length);
  console.log(clean);
}

export const config = {
  width: 960,
  height: 540, /*640*/
  cardWidth: 64, //48
  cardHeight: 96, //64
  slotWidth: 96,
  slotHeight: 128,
  buttonWidth: 96,
  buttonHeight:64,
  infoWidth: 384,
  infoHeight: 108,
  dealCardDelay: 1, //50
  maxPlayers:5,
  version: "0.0.1",
}

let cachedBackground = null;

let gameData = null;

export const odex = new Odex(config.width, config.height);

const sprites = [
  {name: "spritesheet", src: '/art/spritesheet.png'},
  {name: "players", src: '/art/players.png'},
  {name: "background", src: '/art/background.png'}, //background8.jpg
  {name: "player", src: '/art/player.png'},
  {name: "bot", src: '/art/enemy.png'},
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

  DISCARD_CARD: (ev) => {
    gameData.animations.push(new DealAnimation(ev.animation.sx, ev.animation.sy, ev.animation.dx, ev.animation.dy, () => discardCardCallback()));
  },

  BOT_PLAY: (ev) => {
    ev.callback();
  },

  SEND_MESSAGE: (ev) => {
    console.log(ev.msg);
    gameData.infoMessage=ev.msg;
  },

  PICK_TRUMP_CARD: (ev) => {

  },
  
};

function discardCardCallback() {
  gameData.discardedCards++;
}

const DEFAULT_GAME_DATA = {
  deck: [],
  players: [],
  table: [],
  scores: {},
  round: 0,
  turnPlayer: null,
  discardedCards:0,
  //pot: 0,
  //etc: {}
  botObjects: [],
  midObjects: [],
  topObjects: [],
  animations: [],

  winOrder: [],

  mouseX: 0,
  mouseY: 0,
  clicked: false,

  selectedCard: null,
  selectedRival: null,

  cardsToBeat: [],
  dealedBy: null,

  trumpCard:null,
  trumpCardPicked: false,

  infoMessage: "",
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

  gameData.beatArea.update(dt);
  gameData.dealButton.update(dt);
  gameData.raiseButton.update(dt);
}

function renderBot(layer) {
  odex.clear(layer.ctx);

  // drawImage(image, dx, dy)
  // drawImage(image, dx, dy, dWidth, dHeight)
  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

  if (cachedBackground) {
    layer.ctx.drawImage(cachedBackground, 0, 0);
  }

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

  gameData.beatArea.render();

  layer.ctx.fillStyle="#fff";
  layer.ctx.fillText(`Kaadetut kortit: (${gameData.discardedCards})`, config.width-160, 16);

  gameData.infoBox.render();
  gameData.dealButton.render();
  gameData.raiseButton.render();
}

// function getCanvasMousePos(canvas, event) {
//   const rect = canvas.getBoundingClientRect();
//   return {
//     x: Math.floor(event.clientX - rect.left),
//     y: Math.floor(event.clientY - rect.top),
//   };
// }

function getCanvasMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = config.width  / rect.width;
  const scaleY = config.height / rect.height;
  return {
    x: Math.floor((event.clientX - rect.left) * scaleX),
    y: Math.floor((event.clientY - rect.top) * scaleY),
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
}

function preprocessBackground() {
  const bg = odex.getSprite("background"); // 3840x2160
  const buffer = document.createElement("canvas");
  buffer.width = config.width;  // 960
  buffer.height = config.height; // 540
  const bctx = buffer.getContext("2d");
  bctx.imageSmoothingEnabled = false;
  bctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, buffer.width, buffer.height);
  return buffer;
}

function resetGame() {
  odex.G.layers.forEach((layer) => {
    layer.objects=[];
  });
  gameData = {...DEFAULT_GAME_DATA};
  if (eq) eq.clear();
  sm.change(new StartGameState(gameData));
}

document.addEventListener("DOMContentLoaded", async function() {
  await odex.init(sprites, sounds);

  odex.addLayer('#bot');
  odex.addLayer('#mid');
  odex.addLayer('#top');

  odex.G.layers.forEach((layer) => {
    const l = layer.layer;
    console.log("layer");
    console.log(layer);
    const scale= 1;
    l.width = config.width;
    l.height = config.height;
    l.style.width = `${Math.floor(config.width * scale)}px`;
    l.style.height = `${Math.floor(config.height * scale)}px`;

    layer.ctx.imageSmoothingEnabled = false;
    layer.ctx.webkitImageSmoothingEnabled = false;
    layer.ctx.mozImageSmoothingEnabled = false;
    layer.ctx.msImageSmoothingEnabled = false;
  });

  odex.loop();

  //sm.change(new StartGameState(gameData));
  resetGame();

  cachedBackground = preprocessBackground();

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

    layers[2].ctx.fillText(`current player: ${gameData.players[gameData.turnPlayer].playerName}`, 32,64);
    if(gameData.dealedBy) layers[2].ctx.fillText(`dealed by: ${gameData.dealedBy.playerName}`, 32,96);

  });

  document.addEventListener("keyup", function(e) {
    //debug rmv later
    if (e.code === "Space" && sm.current.constructor.name === "PlayTurnState") {
      //switch turn
      //gameData.turnPlayer = (gameData.turnPlayer + 1) % gameData.players.length;
      gameData.dealedBy = gameData.players[gameData.turnPlayer];
      gameData.turnPlayer = Maija.nextTurn(gameData);
    } else if (e.code === "KeyR") {
      resetGame();      
    }

    console.log(e.code);
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
      const nextPlayer = gameData.players[Maija.nextTurn(gameData)]; //gameData.players[(gameData.turnPlayer + 1) % gameData.players.length];
      const selectedCards = player.hand.filter((card) => card.selected);
      const mouseRect = {x:gameData.mouseX, y:gameData.mouseY, w:1, h:1};

      // CHECK IF PLAYER IS CLICKING ON HAND CARDS
      // =========================================
      clickHandCards(player, mouseRect);
      
      // CHECK IF PLAYER IS CLICKING ON BEATABLE CARDS
      // =========================================
      clickBeatableCards(player, mouseRect);

      // CHECK IF PLAYER IS CLICKING ON DEAL BUTTON
      // ==========================================
      clickDealButton(player, nextPlayer, mouseRect, selectedCards);

      // CHECK IF PLAYER IS CLICKING ON RAISE BUTTON
      // ===================================================
      clickRaiseButton(player, mouseRect);
    }

    //console.log(`Click at (${gameData.mouseX}, ${gameData.mouseY})`);
  });

  // resizeGame();
  // window.addEventListener("resize", resizeGame);
  // window.addEventListener("orientationchange", resizeGame);
});

function resizeGame() {
  const scale = Math.min(
    window.innerWidth / config.width,
    window.innerHeight / config.height
  );

  const gameRoot = document.getElementById("gameContainer");
  gameRoot.style.transformOrigin = "top left";
  gameRoot.style.transform = `scale(${scale})`;

  gameRoot.style.position = "absolute";
  gameRoot.style.left = `${(window.innerWidth - config.width * scale) / 2}px`;
  gameRoot.style.top  = `${(window.innerHeight - config.height * scale) / 2}px`;
}

function clickBeatableCards(player, mouseRect) {
  for (let i = 0; i < gameData.cardsToBeat.length; i++) {
    const c = gameData.cardsToBeat[i];
    const cardRect = {x:c.x, y:c.y, w:c.w, h:c.h};
    if (Collision.rect(mouseRect, cardRect) && c.isVisible) {
      if (c.isBeatable) {
        gameData.selectedRival = c;
        if (gameData.selectedCard) {
          Maija.evaluate(gameData.selectedCard, gameData.selectedRival, player, gameData);
          gameData.selectedCard=null; 
          gameData.selectedRival=null;
        }
      }
      return;
    }
  }
}

function allowOneSuitSelected(player, suit, selected) {
  const selectedCards = player.hand.filter((card) => card.selected);
  // on/off toggle on first selected card
  if (selectedCards.length<1){ 
    return !selected;
  } else {
    // if more than one cards selected, allow toggle only if suit matches the suit of other selected cards
    for(let i = 0; i < player.hand.length; i++) {
      const c=player.hand[i];
      if (c.selected && c.suit === suit) {
        return !selected;
      }
    }
  }
  //multiple suits cant be selected
  eq.emit({type:"SEND_MESSAGE", msg: "Selected cards must be of same suit!"});
  return false;
}

function clickHandCards(player, mouseRect) {
  for (let i = 0; i < player.hand.length; i++) {
    const c = player.hand[i];
    const cardRect = {x:c.x, y:c.y, w:c.w, h:c.h};
    if (Collision.rect(mouseRect, cardRect) && c.isVisible) {
      if (gameData.cardsToBeat.length === 0) {
        // if no cards to beat, can select multiple
        //c.selected = !c.selected;
        c.selected=allowOneSuitSelected(player, c.suit, c.selected);
      } else {
        // if beating, only select one
        gameData.selectedCard = c;
        if (gameData.selectedRival) {
          Maija.evaluate(gameData.selectedCard, gameData.selectedRival, player, gameData);
          gameData.selectedCard=null; 
          gameData.selectedRival=null;
        }
      }
      return;
    }
  }
}

function clickDealButton(player, nextPlayer, mouseRect, selectedCards) {
  const dealButton = gameData.dealButton;
  const dealButtonRect = {x: dealButton.x, y: dealButton.y, w: dealButton.w, h: dealButton.h};
  if (dealButton && dealButton.active && Collision.rect(mouseRect, dealButtonRect)) {
    Maija.dealCards(gameData, player, nextPlayer, selectedCards);
  }
}

function clickRaiseButton(player, mouseRect) {
  const raiseButton = gameData.raiseButton;
  const raiseButtonRect = {x: raiseButton.x, y: raiseButton.y, w: raiseButton.w, h: raiseButton.h};
  if (raiseButton && raiseButton.active && Collision.rect(mouseRect, raiseButtonRect)) {
    console.log("raise butotn clcik!");
    Maija.raiseCards(gameData, player, gameData.cardsToBeat);
    Maija.draw(player, gameData);
  }
}