import { Card } from "./Card.js";
import { CardUtil } from "./CardUtil.js";
import { config, eq } from "./game.js";
import { Util } from "./Util.js";

export const Maija = {
  evaluate(card, rival, player, game) {
    const trumpSuit = game.trumpCard.suit;

    if (!card || !rival) {
      console.log(`cant compare card: ${card} and rival: ${rival}!`);
      return false;
    }
    if (this.isQueenOfSpades(rival)) {
      eq.emit({type:"SEND_MESSAGE", msg: "Patarouvaa ei voi kaataa!"});
      return false;
    }

    if (this.isQueenOfSpades(card)) {
      eq.emit({type:"SEND_MESSAGE", msg: "Patarouvalla ei voi kaataa!"});
      return false;
    }
    
    // both are trump suited so only higher card can beat
    if (card.suit === trumpSuit && rival.suit === trumpSuit) {
      if (card.value > rival.value) {
        this.discardPair(card, player.hand, rival, game.cardsToBeat);
      }
    } 
    // only card is trump suited so anything can beat a rival
    else if (card.suit === trumpSuit && rival.suit !== trumpSuit) {
      eq.emit({type: "SEND_MESSAGE", msg: `${player.playerName} kaataa valtilla!`});
      this.discardPair(card, player.hand, rival, game.cardsToBeat);
    }
    // both are same suited but not trump suited so again, only higher card can beat
    else if(card.suit === rival.suit) {
      if(card.value>rival.value) {
        this.discardPair(card, player.hand, rival, game.cardsToBeat);
      }
    }

  },

  isQueenOfSpades(card) {
    return card.suit === "Spades" && card.rank === "Q";
  },

  discardPair(card, hand, rival, ctb){
    if (!card || !rival) {
      console.log(`cant compare card: ${card} and rival: ${rival}!`);
      return;
    }

    console.log(`card: ${card} - rival: ${rival} discarded!`);
    Util.removeInstance(hand, card);
    const cardAnimation = {
      sx:card.x,
      sy:card.y,
      dx:config.width-32,
      dy:0
    }
    eq.emit({type: "DISCARD_CARD", animation:cardAnimation});

    Util.removeInstance(ctb, rival);
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

      if (selectedCards.length > nextPlayer.hand.length) {
        eq.emit({type:"SEND_MESSAGE", msg:"Et voi lyödä enemmän kortteja kuin seuraavalla pelaajalla on kädessä!"});
        return false;
      }

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
  },

  announceWinner(game) {
    
  }

}