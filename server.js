const express = require("express");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const parseurl = require("parseurl");
const bodyParser = require("body-parser");


const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(session({
  secret: "elvis",
  resave: false,
  saveUninitialized: true
}));

let shoe = [];

app.get("/", function(req, res) {
  res.redirect("/index");
});

app.get("/index", function(req, res) {
  res.render("index");
});

app.get("/game", function(req, res) {
  res.render("game");
});

app.post("/index", function(req, res) {
  res.redirect("/game");
});

module.exports = {shoe};

app.listen(3000, function () {
  console.log("Blackjack app started on: 3000");
});
