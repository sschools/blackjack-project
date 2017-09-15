//write playDealer function next

let newShoe = [];
let numDecks = 8; //number of deck in a shoe
let gameStart = false;
let index = 0;
let gameMain = document.querySelector("main");
let html = "";
let dealer = {
  hand: [],
  total: 0,
  bJack: false,
  bust: false,
  ace: false,
  stand: false
};

function Player() {
  this.hands = [];
  this.bankroll = [];
  this.bets = [];
  this.buttons = { hit: {}, stand: {}, double: {}, split: {} };
}

function Hand() {
  this.cards = [];
  this.total = 0;
  this.bJack = false;
  this.bust = false;
  this.ace = false;
  this.stand = false;
  this.totalText = "";
}

let player1 = new Player();

player1.hands[0] = new Hand();

if (!gameStart) {
  beginGame();
  setView();
}

function setView() {
  if (dealer.hand.length === 0) {
    html = `
      <button type="button" class="dealButton">Deal Cards</button>
    `;
  } else {
    html = `
      <div class="dealer">
      <h3>Dealer's Hand:</h3>
    `;
    for (let i = 0; i < dealer.hand.length; i++) {
      html += `<span>${dealer.hand[i].name}</span>
      `
    }
    html += `</div><br>
    <div class="player">
    <h3>Player Hand:</h3>
    `
    for (let i = 0; i < player1.hands[0].cards.length; i++) {
      html += `<span>${player1.hands[0].cards[i].name}</span>
      `
    }
    html += `<span>   Total: ${player1.hands[0].totalText}</span>
    </div>
      <br>
      <button type="button" class="hitButton">Hit</button>
      <button type="button" class="standButton">Stand</button>
      <button type="button" class="doubleButton">Double Down</button>
      <button type="button" class="splitButton">Split</button>
      <br>
      <h3>Bankroll: ${player1.bankroll[0]}
    `;
    if (player1.hands[0].bust) {
      html += `
      <br>
      <h2>You Busted!</h2>
      `
    }
    if (dealer.bJack) {
      html += `
      <br>
      <h2>Dealer Had Blackjack. You Lose!</h2>
      `
    }
  }

  gameMain.innerHTML = html;
  let dealButton = document.querySelector(".dealButton");
  player1.buttons.hit = document.querySelector(".hitButton");
  player1.buttons.stand = document.querySelector(".standButton");
  player1.buttons.double = document.querySelector(".doubleButton");
  player1.buttons.split = document.querySelector(".splitButton");
  if (player1.buttons.hit) {
    player1.buttons.hit.addEventListener("click", hit);
    player1.buttons.stand.addEventListener("click", stand);
    player1.buttons.double.addEventListener("click", doubleDown);
    player1.buttons.split.addEventListener("click", split);
  }
  if (dealButton) {
    dealButton.addEventListener("click", deal);
  }
  if (player1.buttons.hit) {
    checkButtons();
  }
}

function beginGame() {
  gameStart = true;
  index = 1;
  newShoe = loadShoe();
}

function loadShoe() {
  let shoe = [];
  let suites = ["H", "D", "S", "C"];
  for (let i = 0; i < numDecks; i++) {
    for (let j = 0; j < suites.length; j++) {
      for (let k = 2; k < 11; k++) {
        shoe.push({"name": k + suites[j], "value": k});
      }
      shoe.push({"name": "A" + suites[j], "value": 1});
      shoe.push({"name": "J" + suites[j], "value": 10});
      shoe.push({"name": "Q" + suites[j], "value": 10});
      shoe.push({"name": "K" + suites[j], "value": 10});
    }
  }
   return shuffle(shoe);
}

function shuffle(shoe) {
  for (let i = shoe.length - 1; i > 0; i--) {
    let x = Math.floor(Math.random() * i);
    let temp = shoe[x];
    shoe[x] = shoe[i];
    shoe[i] = temp;
  }
  return shoe;
}

function deal() {
  player1.hands[0].cards[0] = newShoe[index];
  dealer.hand[0] = newShoe[index+1];
  player1.hands[1].cards[0] = newShoe[index+2];
  dealer.hand[1] = newShoe[index+3];
  index+= 4;
  player1.hands[0].bust = false;
  console.log(player1.hands[0]);
  console.log(dealer.hand);
  checkDealerBlackjack();
  setTotal(player1.hands[0]);
  setView();
}

function setTotal(hand) {
  hand.total = 0;
  for (let i = 0; i < hand.cards.length; i++) {
    hand.total += hand.cards[i].value;
    if (hand.cards[i].name.includes("A")) {
      hand.ace = true;
    }
  }
  if (hand.total < 12 && hand.ace) {
    hand.totalText = hand.total + " or " + (hand.total + 10);
    hand.total += 10;
  } else {
    hand.totalText = hand.total;
  }
  checkBust(hand);
  return hand;
}

function checkBust(hand) {
  if (hand.total > 21) {
    hand.bust = true;
  }
  endHand();
}

function checkButtons() {
  player.buttons.hit.disabled = false;
  player.buttons.stand.disabled = false;
  player.buttons.double.disabled = false;
  player.buttons.split.disabled = false;
  if (player.bust) {
    player.buttons.hit.disabled = true;
    player.buttons.stand.disabled = true;
    player.buttons.double.disabled = true;
    player.buttons.split.disabled = true;
  } else if (player.hand.length > 2) {
    player.buttons.double.disabled = true;
    player.buttons.split.disabled = true;
  } else {
    if (player.hand[0].value !== player.hand[1].value) {
      player.buttons.split.disabled = true;
    }
  }
}

function hit() {
  player.hand.push(newShoe[index]);
  index += 1;
  setTotal();
  setView();
}

function stand() {
  player.stand = true;
  setTotal();
  playDealer();
}

function doubleDown() {

}

function split() {

}

function checkDealerBlackjack() {
  if ((dealer.hand[0].value === 1 && dealer.hand[1].value === 10) || (dealer.hand[1].value === 1 && dealer.hand[0].value === 10)) {
    dealer.bJack = true;
  }
}

function playDealer(hand) {
  let ace = false;
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].value === 1) {
      ace = true;
    }
    hand.total += hand[i].value;
  }
  if (ace && hand.total < 12) {
    hand.total += 10;
  }
}

function endHand() {

}
