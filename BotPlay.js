import { config, eq, odex, sm } from "./game.js";
import { Maija } from "./Maija.js";

function separateCardsBySuit(hand) {
  const separated = {
    Spades: [],
    Hearts: [],
    Clubs: [],
    Diamonds: [],
  }
  for(let i=0; i < hand.length; i++) {
    const c=hand[i];
    separated[c.suit].push(c);
  }

  for (const suit in separated) {
    separated[suit].sort((a, b) => a.value - b.value);
  }

  return separated;
}

function naiveBeat(rival,hand,separated,ctb, trumpSuit){
  const rivalKey=`${rival.suit}-${rival.rank}`;
  // special case for queen of spades
  if (rival.suit === "Spades" && rival.rank === "Q") {
    console.log("Queen of Spades cannot be beaten!");
    return false;
  }

  // beat with same suit
  const sameSuitCards = separated[rival.suit]
    .filter(c => c.value > rival.value)
    .sort((a,b) => a.value - b.value);

  if (sameSuitCards.length > 0) {
    const card = sameSuitCards[0];
    const cardKey = `${card.suit}-${card.rank}`;

    Maija.discardPair(card, hand, rival, ctb);

    console.log(`${cardKey} beats ${rivalKey}`);
    return true;
  }

  // if same suit failed --> try with trump cards
  // const trumpSuit = trumpCard.suit;
  const trumpCards = separated[trumpSuit]
    .filter(c => c.value > rival.value)
    .sort((a,b) => a.value - b.value);

  if (trumpCards.length > 0) {
    const card = trumpCards[0];
    const cardKey = `${card.suit}-${card.rank}`;
;
    Maija.discardPair(card, hand, rival, ctb);
    console.log(`TRUMP! ${cardKey} beats ${rivalKey}`);
    return true;
  }

  // Nothing could beat it
  console.log(`${rivalKey} could not be beaten`);
  return false;
}

export function botPlay(game) {
  const player=game.players[game.turnPlayer];
  const nextPlayer=game.players[(game.turnPlayer + 1) % game.players.length];
  const hand=player.hand;
  const ctb=game.cardsToBeat;
  const trumpSuit=game.trumpCard.suit;
  const rivals = [...ctb].sort((a,b) => a.value - b.value);
  //try to beat
  if(ctb.length>0) {
    for(const rival of rivals) {
      const separated = separateCardsBySuit(hand);
      naiveBeat(rival, hand, separated, ctb, trumpSuit);
    }
  }

  if (ctb.length===0) {
    // change later
    if (hand.length>0) {
      hand[0].selected = true;
      const selectedCards = hand.filter((card) => card.selected);
      Maija.dealCards(game, player, nextPlayer, selectedCards);
    }
  }else {
    Maija.raiseCards(game, player, ctb);
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

