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
  bJack: false,
  bust: false,
  bankroll: [],
  bets: []
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
    `;
    for (let i = 0; i < dealer.hand.length; i++) {
      html += `<span>${dealer.hand[i].name}</span>
      `
    }
    html += `</div><br>
    <div class="player">`
    for (let i = 0; i < player.hand.length; i++) {
      html += `<span>${player.hand[i].name}</span>
      `
    }
    html += `</div>`
  }
  gameMain.innerHTML = html;
  let dealButton = document.querySelector(".dealButton");
  if (dealButton) {
    dealButton.addEventListener("click", deal);
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
  console.log(player.hand);
  console.log(dealer.hand);
  setView();
}
