export const CardUtil = {
  createDeck() {
    const SUITS = ["Spades", "Hearts", "Diamonds", "Clubs"];
    const RANKS = [
      { rank: "A", value: 11 },
      { rank: "2", value: 2 },
      { rank: "3", value: 3 },
      { rank: "4", value: 4 },
      { rank: "5", value: 5 },
      { rank: "6", value: 6 },
      { rank: "7", value: 7 },
      { rank: "8", value: 8 },
      { rank: "9", value: 9 },
      { rank: "10", value: 10 },
      { rank: "J", value: 10 },
      { rank: "Q", value: 10 },
      { rank: "T", value: 10 },
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