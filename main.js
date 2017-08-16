let shoe = [];
let numDecks = 8; //number of deck in a shoe

function loadShoe() {
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

let newShoe = loadShoe();
console.log(newShoe);
