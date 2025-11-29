const CardUtil = {
  createDeck() {
    const SUITS = ["Spades", "Hearts", "Diamonds", "Clubs"];
    const RANKS = [
      { rank: "A", value: 14 },
      { rank: "2", value: 2 },
      { rank: "3", value: 3 },
      { rank: "4", value: 4 },
      { rank: "5", value: 5 },
      { rank: "6", value: 6 },
      { rank: "7", value: 7 },
      { rank: "8", value: 8 },
      { rank: "9", value: 9 },
      { rank: "10", value: 10 },
      { rank: "J", value: 11 },
      { rank: "Q", value: 12 },
      { rank: "T", value: 13 },
    ];
  
    const deck = [];
    for (const suit of SUITS) {
      for (const r of RANKS) {
        deck.push({
          rank: r.rank,
          suit,
          value: r.value,
        });
      }
    }
    return deck;
  },
  
  //fisher-yates shuffle
  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  },
  
  draw(deck) {
    //return deck.pop();
    return deck.shift();
  }
   
}

class Card {
  constructor(value, rank, suit){
    this.value=value;
    this.rank=rank;
    this.suit=suit;
  }
}

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

function removeInstance(arr, instance) {
  const i = arr.indexOf(instance);
  if (i !== -1) {
    arr.splice(i, 1);
  }
}

function beatCard(rival, hand, separated,ctb) {
  const rivalKey = `${rival.suit}-${rival.rank}`;

  // beat with same suit
  const sameSuitCards = separated[rival.suit]
    .filter(c => c.value > rival.value)
    .sort((a,b) => a.value - b.value);

  if (sameSuitCards.length > 0) {
    const card = sameSuitCards[0];
    const cardKey = `${card.suit}-${card.rank}`;

    removeInstance(hand, card);
    removeInstance(ctb, rival);

    console.log(`${cardKey} beats ${rivalKey}`);
    return true;
  }

  // if same suit failed --> try with trump cards
  const trumpSuit = trumpCard.suit;
  const trumpCards = separated[trumpSuit]
    .filter(c => c.value > rival.value)
    .sort((a,b) => a.value - b.value);

  if (trumpCards.length > 0) {
    const card = trumpCards[0];
    const cardKey = `${card.suit}-${card.rank}`;

    removeInstance(hand, card);
    removeInstance(ctb, rival);

    console.log(`TRUMP! ${cardKey} beats ${rivalKey}`);
    return true;
  }

  // Nothing could beat it
  console.log(`${rivalKey} could not be beaten`);
  return false;
}

function root(hand, ctb) {
  const rivals = [...ctb].sort((a,b) => a.value - b.value);
  for (const rival of rivals) {
    const separated = separateCardsBySuit(hand);
    beatCard(rival, hand, separated, ctb);
  }

  console.log("Remaining in hand:", hand.length);
  console.log("Remaining to beat:", ctb.length);

  if (ctb.length === 0) {
    console.log("You can deal!");
  } else {
    console.log("You have to raise! :/");
  }
}

const deck = CardUtil.shuffle(CardUtil.createDeck());
const hand=[];
const ctb=[];
const trumpCard = deck.pop();
for (let i=0; i<5;i++) {
  const c = CardUtil.draw(deck);
  hand.push(new Card(c.value, c.rank, c.suit));
}

ctb.push(new Card(9, "9", "Clubs" ));
ctb.push(new Card(5, "5", "Clubs" ));
ctb.push(new Card(7, "7", "Clubs" ));
ctb.push(new Card(10, "10", "Clubs" ));
ctb.push(new Card(14, "A", "Clubs" ));


//console.log(deck);
// console.log(hand);
console.log("cards to beat:")
console.log("---------------")
console.log(ctb);
console.log("---------------")
console.log("your hand:")
console.log(hand);
console.log("---------------")
console.log("trumpCard: " + trumpCard.suit);
console.log("---------------")


root(hand, ctb);
