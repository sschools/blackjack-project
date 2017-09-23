//hit function working... is not checking for a bust
let newShoe = [];
let numDecks = 8; //number of deck in a shoe
let numPlayers = 0;
let seats = []; //empty array to hold players
let gameStart = false;
let index = 0; //place in shoe
let gameMain = document.querySelector("main");
let html = "";
let currentPlayer = 0;
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
  this.buttons = { hit: {}, stand: {}, double: {}, split: {} }; //DOM objects defined in setButtons
}

function Hand() {
  this.cards = [];  //this. items aren't recognized in function calls from outside object
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
  this.hit = function(event) { //the value on the event target is the player number
    player = event.target.value;
    cards = getCards(player);
    cards.push(newShoe[index]);
    index += 1;
    this.total = seats[player].hands[0].setTotal(cards);
    setView();
  }
  this.stand = function() {

  }
  this.doubleDown = function() {

  }
  this.split = function() {

  }
}

function getCards(player) {  //this is used when events are called and the cards are not recognized
  return seats[player].hands[0].cards;
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
}

function domAndListeners() {
  if (numPlayers < 1) {
    let playerForm = document.querySelector(".playerForm");
    playerForm.addEventListener("submit", setPlayers);
  } else if (dealer.hand.length === 0) {
    let dealButton = document.querySelector(".dealButton");
    dealButton.addEventListener("click", deal);
  } else {
    setButtons();
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

  for (let i = 0; i < seats.length; i++) {
    html += `</div><br>
    <div class="player">
    <h3>Player ${i + 1} Hand:</h3>
    `
    let current = seats[i];
    for (let j = 0; j < current.hands[0].cards.length; j++) {
      html += `<span>${current.hands[0].cards[j].name}</span>
      `
    }
  html += `<span>   Total: ${current.hands[0].totalText}</span>
  </div>
    <br>
    <button type="button" id="player${i}hit" value="${i}">Hit</button>
    <button type="button" id="player${i}stand">Stand</button>
    <button type="button" id="player${i}double">Double Down</button>
    <button type="button" id="player${i}split">Split</button>
    <br>
    <h3>Bankroll: ${current.bankroll[0]}
  `;

  // this will move when game play is going
  if (current.hands[0].bust) {
    html += `
    <br>
    <h2>You Busted!</h2>
    `
  }

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

function setButtons() {
  for (let i = 0; i < seats.length; i++) {
    seats[i].buttons.hit = document.querySelector("#player" + i + "hit");
    seats[i].buttons.stand = document.querySelector("#player" + i + "stand");
    seats[i].buttons.double = document.querySelector("#player" + i + "double");
    seats[i].buttons.split = document.querySelector("#player" + i + "split");
    seats[i].buttons.hit.addEventListener("click", seats[i].hands[0].hit);
    seats[i].buttons.stand.addEventListener("click", seats[i].hands[0].stand);
    seats[i].buttons.double.addEventListener("click", seats[i].hands[0].doubleDown);
    seats[i].buttons.split.addEventListener("click", seats[i].hands[0].split);
  }
  for (let i = 0; i < seats.length; i++) {
    seats[i].buttons.hit.disabled = false;
    seats[i].buttons.stand.disabled = false;
    seats[i].buttons.double.disabled = false;
    seats[i].buttons.split.disabled = false;
  }
  for (let i = 0; i < seats.length; i++) {
    if (currentPlayer === i) {
      if (seats[i].hands[0].length > 2) {
        seats[i].buttons.double.disabled = true;
        seats[i].buttons.split.disabled = true;
      } else if (seats[i].hands[0].cards[0].value !== seats[i].hands[0].cards[1].value) {
        seats[i].buttons.split.disabled = true;
      }
    } else {
      seats[i].buttons.hit.disabled = true;
      seats[i].buttons.stand.disabled = true;
      seats[i].buttons.double.disabled = true;
      seats[i].buttons.split.disabled = true;
    }
  }
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
