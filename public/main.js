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
  bust: false
};
let player = {
  hand: [],
  total: 0,
  totalText: "",
  bJack: false,
  bust: false,
  bankroll: [],
  bets: [],
  buttons: {
    hit: {},
    stand: {},
    double: {},
    split: {}
  }
}

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
    for (let i = 0; i < player.hand.length; i++) {
      html += `<span>${player.hand[i].name}</span>
      `
    }
    html += `<span>   Total: ${player.totalText}</span>
    </div>
      <br>
      <button type="button" class="hitButton">Hit</button>
      <button type="button" class="standButton">Stand</button>
      <button type="button" class="doubleButton">Double Down</button>
      <button type="button" class="splitButton">Split</button>
    `;
    if (player.bust) {
      html += `
      <br>
      <h2>You Busted!</h2>
      `
    }
  }
  gameMain.innerHTML = html;
  let dealButton = document.querySelector(".dealButton");
  player.buttons.hit = document.querySelector(".hitButton");
  player.buttons.stand = document.querySelector(".standButton");
  player.buttons.double = document.querySelector(".doubleButton");
  player.buttons.split = document.querySelector(".splitButton");
  if (player.buttons.hit) {
    player.buttons.hit.addEventListener("click", hit);
    player.buttons.stand.addEventListener("click", stand);
    player.buttons.double.addEventListener("click", doubleDown);
    player.buttons.split.addEventListener("click", split);
  }
  if (dealButton) {
    dealButton.addEventListener("click", deal);
  }
  if (player.buttons.hit) {
    checkButtons();
  }
}

function beginGame() {
  gameStart = true;
  index = 1;
  newShoe = loadShoe();
  console.log(newShoe);
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
  player.hand[0] = newShoe[index];
  dealer.hand[0] = newShoe[index+1];
  player.hand[1] = newShoe[index+2];
  dealer.hand[1] = newShoe[index+3];
  index+= 4;
  player.bust = false;
  console.log(player.hand);
  console.log(dealer.hand);
  setTotal();
  setView();
}

function setTotal() {
  let ace = false;
  player.total = 0;
  for (let i = 0; i < player.hand.length; i++) {
    player.total += player.hand[i].value;
    if (player.hand[i].name.includes("A")) {
      ace = true;
    }
  }
  if (player.total < 12 && ace) {
    player.totalText = player.total + " or " + (player.total + 10);
  } else {
    player.totalText = player.total;
  }
  checkBust();
}

function checkBust() {
  if (player.total > 21) {
    player.bust = true;
  }
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
  let x = player.hand.length;
  player.hand.push(newShoe[index]);
  index += 1;
  setTotal();
  setView();
}

function stand() {

}

function doubleDown() {

}

function split() {

}
