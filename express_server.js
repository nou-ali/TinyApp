const { checkUsers, urlsForUser, generateRandomString } = require('./helper.js');
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; //default port

//Making data readable for humans
app.use(bodyParser.urlencoded({extended: true})); //

app.use(cookieSession({
  name: 'session',
  keys: ["mX0Du4hAQg", "DTTa4Hm3Zm"],
}));

//This tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");


// urlDatabase
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID"
  }
};

//user database

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//name of method, path and what we're goin to do
app.get("/", (req, res) => {
  res.redirect("/urls");
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
  const user = users[req.session["user_id"]];
  //console.log(users); // checked if password was hashed
  let templateVars;
  if (user) {
    const userID = user.id;
    const urls = urlsForUser(userID, urlDatabase);
    templateVars = {
      urls: urls,
      user: user,
      error: null
    };
    
  } else {
    templateVars = {
      urls: {},
      user: null,
      error: "Please login"
    };
  }
  res.render('urls_index', templateVars);
});

//creating a post req to shortURL-longURL key-value pair are saved to the urlDatabase when it receives a POST request to /urls
// will then be redirected to the shortURL page
app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const userID = req.session["user_id"];
  urlDatabase[shortURL] = {longURL, userID};
  res.redirect(`/urls/${shortURL}`);
});

//Redirect any request to "/u/:shortURL" to its longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(longURL);
  res.redirect(longURL);
});

//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  console.log("request",req.params);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: users[req.session["user_id"]] };
  // if unauthorized login redirect to login page, other users and go to urls_new
  if (!templateVars.user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {  //need to prevent from deeleting.
  if (urlDatabase[req.params.shortURL].userID !== req.session["user_id"]) {
    return res.status(401).send('Url is not yours');
  }
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(401).send('Not authorized');
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls"); // after pressing delete, redirects to http://localhost:8080/urls
});

// Creates shortened URL, created a map for urlDatabase
//req.params will return parameters in the matched route.
app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.redirect("/urls");
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session["user_id"]] };
  if (req.session["user_id"] === urlDatabase[req.params.shortURL].userID) {
    res.render("urls_show", templateVars);
  } else {
    return res.status(401).send('unauthorized user');
  }
  
});

app.post("/urls/:id", (req, res) => {
  
  if (!urlDatabase[req.params.id]) {
    return res.status(401).send('Error... url does not exist');
  }
  
  if (urlDatabase[req.params.id].userID !== req.session["user_id"]) {
    return res.status(401).send('Url is not yours');
  }

  if (!urlDatabase[req.params.id]) {
    return res.status(401).send('Not authorized');
  }

  urlDatabase[req.params.id].longURL = req.body.longURL; // it should modify the corresponding longURL, and then redirect the client back to "/urls".
  req.session.username = req.body.username;
  res.redirect("/urls");


});

//Registering users
app.get("/register", (req, res) => {
  const currentUser = users[req.session["user_id"]];
  const templateVars = {
    user : currentUser };
  console.log(currentUser);
  res.render("register", templateVars);
});


app.post("/register", (req, res) => {
  // need to add new user to users object
  //id, email, password --> generateRandomString
  const newEmail = req.body.email;
  const newPassword = bcrypt.hashSync(req.body.password, 10); // Modifying registration endpoint to use bcrypt to hash the password
  const user = checkUsers(newEmail, users);
  if (user) {
    return res.status(403).send('a user with that email already exists');
  }
  
  if (newEmail === "" || newPassword === "") {
    return res.status(400).send("email and password cannot be blank");
  }
 
  const newUserId = generateRandomString();
  const newUser = {
    id: newUserId,
    email: newEmail,
    password: newPassword
  };
  

  users[newUserId] = newUser;
  
  req.session.user_id = newUserId;
  res.redirect("/urls");
});

//login
app.get('/login', (req, res) => {
  const templateVars = { urls: urlDatabase,
    user: users[req.session["user_id"]] };
  res.render('login', templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = checkUsers(email, users);
  
  if (!user) {
    return res.status(403).send('invalid credentials');
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send('invalid credentials');
  }
  
  req.session.user_id = user.id;
  res.redirect("/urls");
});



//logout
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});