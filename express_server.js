const express = require("express"); 
const app = express();
const PORT = 8080; //default port

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

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

//Sending HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});