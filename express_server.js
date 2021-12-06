const express = require("express");
const app = express();
const PORT = 8080; //default port

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//name of method, path adn what we're goin to do
app.get("/", (req, res) => {
  res.send("Hello!");

});

//Showcase JSON string representing the entire urlDatabase object
app.get("/urls.json", (req, res) => { 
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});