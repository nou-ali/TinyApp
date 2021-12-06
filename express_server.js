const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; //default port

//Making data readable for humans
app.use(bodyParser.urlencoded({extended: true}));

//In order to simulate generating a "unique" shortURL, for now we will implement a function that returns a string of 6 random alphanumeric characters
const generateRandomString = (length = 8) => {
  return Math.random().toString(16).substring(2, length);
};

//console.log(generateRandomString(8));

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

// route for /urls_index.ejs, will pass the URL data to our template.
//When sending variables to an EJS template, we need to send them inside an object
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//creating a post req to shortURL-longURL key-value pair are saved to the urlDatabase when it receives a POST request to /urls
// will then be redirected to the shortURL page
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);         
});

//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Creates shortened URL, created a map for urlDatabase
//req.params will return parameters in the matched route.
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});