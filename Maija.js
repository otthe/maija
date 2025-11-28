import { Card } from "./Card.js";
import { CardUtil } from "./CardUtil.js";
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
    game.dealedBy = null;

    console.log("contains: " + game.cardsToBeat.length);
    this.nextTurn(game);
  },

  dealCards(game, player, nextPlayer, selectedCards) {
    if (selectedCards.length > 0) {
      player.hand = player.hand.filter((card) => !card.selected);
      game.cardsToBeat = selectedCards;

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

      while (player.hand.length < 5 && game.deck.length > 0 ){
        const card = CardUtil.draw(game.deck);
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
      game.selectedCard=null; 
      game.selectedRival=null;
      game.dealedBy=player;
      this.nextTurn(game);
    } else {
      eq.emit({ type: "SEND_MESSAGE", msg: "You need to select cards!"});
    }
  },

  nextTurn(game) {
    return game.turnPlayer = (game.turnPlayer + 1) % game.players.length;
  }

}