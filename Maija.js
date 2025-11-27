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

  }
}