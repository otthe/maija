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

function suitWithMostCards(separated) {
  let maxSuit = null;
  let maxCount = -1;

  for (const suit in separated) {
    if (separated[suit].length > maxCount) {
      maxCount = separated[suit].length;
      maxSuit = suit;
    }
  }
  return maxSuit;
}

function naiveBeat(rival,hand,separated,ctb, trumpSuit){
  const rivalKey=`${rival.suit}-${rival.rank}`;
  // special case for queen of spades
  if(Maija.isQueenOfSpades(rival)) {
    return false;
  }

  // beat with same suit
  const sameSuitCards = separated[rival.suit]
    .filter(c => c.value > rival.value)
    .sort((a,b) => a.value - b.value);

  if (sameSuitCards.length > 0) {
    const card = sameSuitCards[0];
    const cardKey = `${card.suit}-${card.rank}`;

    // maybe it would be more efficient to just filter out the QS - whatever
    if (!Maija.isQueenOfSpades(card)) {
      Maija.discardPair(card, hand, rival, ctb);
    }
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

    // maybe it would be more efficient to just filter out the QS - whatever
    if (!Maija.isQueenOfSpades(card)) {
      Maija.discardPair(card, hand, rival, ctb);
    }

    console.log(`TRUMP! ${cardKey} beats ${rivalKey}`);
    return true;
  }

  // Nothing could beat it
  console.log(`${rivalKey} could not be beaten`);
  return false;
}


// function naiveDeal(hand) {
//   const separated=separateCardsBySuit(hand);
//   const maxSuit = suitWithMostCards(separated);

//   const npc =2; //next player card amount
//   console.log(separated[maxSuit]);

//   let selectedCards=[];

//   let dealed=0;
//   while(dealed < npc && dealed < separated[maxSuit].length) {
//     selectedCards.push(separated[maxSuit][dealed]);
//     dealed++;
//   }

//   //toggle the selection on real hand cards -- not in the copied 'separated' -object
//   for (let i = 0; i < hand.length; i++) {
//     const card=hand[i];
//     card.selected=false;//make sure that cards are de-selected by default
//     for (let j=0; j < selectedCards.length; j++) {
//       const fakeSelectedCard=selectedCards[j];
//       if (card.suit === fakeSelectedCard.suit && card.rank === fakeSelectedCard.rank) {
//         card.selected = true;
//       }
//     }
//   }

//   return hand;
// }

function naiveDeal(hand, nextPlayer) {
  // const limit = Math.min(opponentCardCount, hand.length);
  // if (limit <= 0) return;

  const separated=separateCardsBySuit(hand);
  const maxSuit = suitWithMostCards(separated);

  let selectedCards=[];

  let dealed=0;
  while(dealed < nextPlayer.hand.length && dealed < separated[maxSuit].length) {
    selectedCards.push(separated[maxSuit][dealed]);
    dealed++;
  }

  //toggle the selection on real hand cards -- not in the copied 'separated' -object
  for (let i = 0; i < hand.length; i++) {
    const card=hand[i];
    card.selected=false;//make sure that cards are de-selected by default
    for (let j=0; j < selectedCards.length; j++) {
      const fakeSelectedCard=selectedCards[j];
      if (card.suit === fakeSelectedCard.suit && card.rank === fakeSelectedCard.rank) {
        card.selected = true;
      }
    }
  }

  return hand;
}

export function botPlay(game) {
  const player=game.players[game.turnPlayer];
  const nextPlayer=game.players[Maija.nextTurn(game)]; //game.players[(game.turnPlayer + 1) % game.players.length];
  const hand=player.hand;
  const ctb=game.cardsToBeat;
  const trumpSuit=game.trumpCard.suit || null; // this is only selected after first play turn
  const rivals = [...ctb].sort((a,b) => a.value - b.value);
  //try to beat
  if(ctb.length>0) {
    for(const rival of rivals) {
      const separated = separateCardsBySuit(hand);
      naiveBeat(rival, hand, separated, ctb, trumpSuit);
    }
  }

  if (ctb.length===0) {
    //bot has no cards to beat so he can deal
    if (hand.length>0) {
      naiveDeal(hand, nextPlayer);
      const selectedCards = hand.filter((card) => card.selected);
      Maija.dealCards(game, player, nextPlayer, selectedCards);
    } else {
      //bot has no cards so check if there is one's to draw - if no take him out of the game
      Maija.isOut(player, game);
      if(!player.isPlaying) {
        eq.emit({type: "SEND_MESSAGE", msg: `${player} on ulkona!`});
      }
      game.turnPlayer=Maija.nextTurn(game); //turn switch should happen every time
    }
  }else {
    // bot could not beat all the cards so he has to raise the ones left
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

