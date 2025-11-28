import { config, eq, odex, sm } from "./game.js";
import { Maija } from "./Maija.js";

function raiseAll(){

}

function raiseSome(){

}

function beatAll() {

}

function decideRaiseStrategy(ctb, hand, trumpSuit) {
  const suit = ctb[0].suit;
  const availableStrategies={raiseAll: true, discardAll: false, raiseSome: false};
  const potentialSameSuit = hand.filter((card) => {card.suit === suit});
  const potentialTrumpSuit = hand.filter((card) => {card.suit === suit && suit === trumpSuit});

  for (let i = 0; i < ctb.length; i++) {
    const c = ctb[i];
    
  }
}

function deciceDealStrategy(hand) {

}

          // if (this.game.cardsToBeat.length > 0 ) {
          //   Maija.raiseCards(this.game, player, this.game.cardsToBeat);
          // } else {
          //   if (player.hand.length > 0) {
          //     player.hand[0].selected = true;
          //     const selectedCards = player.hand.filter((card) => card.selected);
          //     Maija.dealCards(this.game, player, nextPlayer, selectedCards);
          //   }  
          // }

export function botPlay(game) {
  const ctb = game.cardsToBeat;
  const player = game.players[game.turnPlayer];
  const nextPlayer = game.players[(game.turnPlayer + 1) % game.players.length];
  const hand = player.hand;
  const trumpSuit = game.trumpCard.suit;

  if (ctb.length > 0) {
    //decideRaiseStrategy(ctb, hand, trumpSuit);
    Maija.raiseCards(game, player, ctb);
  } else {
    //decideDealStrategy(hand);
    if (hand.length > 0) {
      hand[0].selected = true;
      const selectedCards = hand.filter((card) => card.selected);
      Maija.dealCards(game, player, nextPlayer, selectedCards);
    }
  }
}

/*
if ctb.length > 0
  -> decision(3)
    -> raise all
      -> nextTurn

    - discard all
      -> deal
    
    - discard some, raise some
      -> nextTurn
else {
  -> decision(4)
      ->deal(trump)
      ->deal(amountMax)
      ->deal(amountMin)
      ->deal(queen of spades included)
} 
*/

