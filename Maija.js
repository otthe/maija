import { config, eq } from "./game.js";

function removeInstance(arr, instance) {
  const i = arr.indexOf(instance);
  if (i !== -1) {
    arr.splice(i, 1);
  }
}

export const Maija = {
  evaluate(card, rival, player, game) {
    if (!card || !rival) {
      console.log(`cant compare card: ${card} and rival: ${rival}!`);
      return;

    }
    console.log(`card: ${card} - rival: ${rival} evaluated!`);
    removeInstance(player.hand, card);
    const cardAnimation = {
      sx:card.x,
      sy:card.y,
      dx:config.width-32,
      dy:0
    }
    eq.emit({type: "DISCARD_CARD", animation:cardAnimation});

    removeInstance(game.cardsToBeat, rival);
    const rivalAnimation = {
      sx:rival.x,
      sy:rival.y,
      dx:config.width-32,
      dy:0
    }

    eq.emit({type: "WAIT", ms: 200});
    eq.emit({type: "DISCARD_CARD", animation:rivalAnimation});

  },

  raiseCards(game, player, ctb) {
    for (let i = 0; i < ctb.length; i++) {
      const card = ctb[i];
      card.isVisible=false;
      player.hand.push(card);

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
    game.cardsToBeat=[];
    game.selectedCard=null; 
    game.selectedRival=null;

    console.log("contains: " + game.cardsToBeat.length);
  }
}