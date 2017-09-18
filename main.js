

let newShoe = [];
let numDecks = 8; //number of deck in a shoe
let numPlayers = 0;
let seats = []; //empty array to hold players
let gameStart = false;
let index = 0; //place in shoe
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
  this.bankroll = [1000];
  this.bets = [2];
  this.buttons = { hit: {}, stand: {}, double: {}, split: {} };
}

function Hand() {
  this.cards = [];
  this.bJack = false;
  this.bust = false;
  this.ace = false;
  this.stand = false;
  this.total = 0;
  this.totalText = "";
  this.setTotal = function(cards) {
    let total = 0;
    for (let i = 0; i < cards.length; i++) {
      total += cards[i].value;
      if (cards[i].name.includes("A")) {
        this.ace = true;
      }
    }
    if (total < 12 && this.ace) {
      this.totalText = total + " or " + (total + 10);
      total += 10;
    } else {
      this.totalText = total;
    }
    return total;
  }
  this.checkBust = function(total) {
    let bust = false;
    if (total > 21) {
      bust = true;
    }
    return bust;
  }
  this.hit = function() {
    this.cards.push(newShoe[index]);
    index += 1;
    this.total = this.setTotal(this.cards);
    setView();
  }
}

//body

if (!gameStart) {
  beginGame();
  setView();
}

function setView() {
  html = getHtml();

  gameMain.innerHTML = html;

  domAndListeners();

/*
  player1.buttons.hit = document.querySelector(".hitButton");
  player1.buttons.stand = document.querySelector(".standButton");
  player1.buttons.double = document.querySelector(".doubleButton");
  player1.buttons.split = document.querySelector(".splitButton");
  if (player1.buttons.hit) {
    player1.buttons.hit.addEventListener("click", player1.hands[0].hit);
    player1.buttons.stand.addEventListener("click", stand);
    player1.buttons.double.addEventListener("click", doubleDown);
    player1.buttons.split.addEventListener("click", split);
  }

  if (player1.buttons.hit) {
    checkButtons();
  }
  */
}

function domAndListeners() {
  if (numPlayers < 1) {
    let playerForm = document.querySelector(".playerForm");
    playerForm.addEventListener("submit", setPlayers);
  } else if (dealer.hand.length === 0) {
    let dealButton = document.querySelector(".dealButton");
    dealButton.addEventListener("click", deal);
  } else {

  }
}

function beginGame() {
  gameStart = true;
  index = 1;
  newShoe = loadShoe();
}

function setDealScreen() {
  html = `
    <button type="button" class="dealButton">Deal Cards</button>
  `;
  return html;
}

function setPlayers(event) {
  event.preventDefault();
  numPlayers = event.target.players.value;
  for (let i = 0; i < numPlayers; i++) {
    seats[i] = new Player();
    seats[i].hands[0] = new Hand();
  }
  setView();
}

function setPlayerNum() {
  html = `
      <h2>How Many Players?</h2>
      <br>
      <form class="playerForm">
      <select name="players">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
      <button name="player-enter" type="submit">Start</button>
      </form>
    `;
  return html;
}

function setTableScreen() {
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
  return html;
}

function getHtml() {
  if (numPlayers < 1) {
    html = setPlayerNum();
  } else if (dealer.hand.length === 0) {
    html = setDealScreen();
  } else {
    html = setTableScreen();
  }
  return html;
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
  for (let i = 0; i < numPlayers; i++) {
    seats[i].bust = false;
    seats[i].hands[0].cards[0] = newShoe[index];
    index += 1;
  }
  dealer.hand[0] = newShoe[index];
  index += 1;
  for (let i = 0; i < numPlayers; i++) {
    seats[i].hands[0].cards[1] = newShoe[index];
    index += 1;
  }
  dealer.hand[1] = newShoe[index];
  index += 1;

  checkDealerBlackjack();
  for (let i = 0; i < numPlayers; i++) {
    let temp = seats[i].hands[0];
    temp.total = temp.setTotal(temp.cards);
  }
  setView();
}

function checkButtons() {
  player1.buttons.hit.disabled = false;
  player1.buttons.stand.disabled = false;
  player1.buttons.double.disabled = false;
  player1.buttons.split.disabled = false;
  if (player1.hands[0].bust) {
    player1.buttons.hit.disabled = true;
    player1.buttons.stand.disabled = true;
    player1.buttons.double.disabled = true;
    player1.buttons.split.disabled = true;
  } else if (player1.hands[0].cards.length > 2) {
    player1.buttons.double.disabled = true;
    player1.buttons.split.disabled = true;
  } else {
    if (player1.hands[0].cards[0].value !== player1.hands[0].cards[1].value) {
      player1.buttons.split.disabled = true;
    }
  }
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

}

function endHand() {

}
