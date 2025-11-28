
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

function botPlay(game, hand) {
  const ctb = game.cardsToBeat;
  const player = game.players[game.turnPlayer];
  if (hand.length === 0 && ctb.length === 0) {
    Maija.announceWinner(player);
  }

  if (ctb.length > 0) {
    decideRaiseStrategy(ctb, hand, game.trumpCard.suit);
  } else {
    decideDealStrategy(hand);
  }
}