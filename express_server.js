const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; //default port

//Making data readable for humans
app.use(bodyParser.urlencoded({extended: true})); //false?x
app.use(cookieParser());

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
  const templateVars = { urls: urlDatabase,
    user: users[req.cookies["user_id"]] };
    res.render("urls_index", templateVars);
  });


//POST route that removes a URL resource: POST /urls/:shortURL/delete
//After the resource has been deleted, redirect the client back to the urls_index page ("/urls").
// redirects to another page now?

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls"); // after pressing delete, redirects to http://localhost:8080/urls
});


//creating a post req to shortURL-longURL key-value pair are saved to the urlDatabase when it receives a POST request to /urls
// will then be redirected to the shortURL page
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

//Redirect any request to "/u/:shortURL" to its longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

//Add a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

// Creates shortened URL, created a map for urlDatabase
//req.params will return parameters in the matched route.
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  console.log(req.body);
  //console.log(req.params);
  urlDatabase[req.params.id] = req.body.longURL; // it should modify the corresponding longURL, and then redirect the client back to "/urls".
  res.cookie('username', req.body.username) 
  res.redirect("/urls");
});

//Registering users
app.get("/register", (req, res) => {
  const currentUser = users[req.cookies["user_id"]];
  //users[userRandomOne]
  const templateVars = {
    user : currentUser };
    console.log(currentUser);
  res.render("register", templateVars);
 }); 

//  you need to generate and declare newId using the helper function we created for generating the shortURL, then save it in the cookie
// also need to create email & password variables using req.body (whatever you typed in username & password in registration page)
// then add those in the global object, users


 app.post("/register", (req, res) => {
    // need to add new user to users object
  //id, email, password --> generateRandomString
  const newUserId = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const newUser = {
    id: newUserId,
    email: newEmail,
    password: newPassword
  };
 
  //console.log(users[newUserId]);
  
  if (newUser.email === "" || newUser.password === "") {
    return res.status(400).send("email and password cannot be blank");
  } 
  //console.log(users, newUser);
  for (let ids in users) {
    if (users[ids].email === newUser.email) {
      return res.status(400).send('a user with that email already exists');
    }
  }

  users[newUserId] = newUser;
  

  //console.log(newUser);

  res.cookie('user_id', newUserId);
  res.redirect("/urls");  
});

//login 
app.get('/login', (req, res) => {
  const templateVars = { urls: urlDatabase,
    user: users[req.cookies["user_id"]] };
  res.render('login', templateVars);
 });  


//an endpoint to handle a POST to /login
app.post("/login", (req, res) => {
  // const templateVars = { urls: urlDatabase,
  //   username: req.body["username"] };
  res.cookie("user_id", req.body.username) 
  //console.log(req.body)
  res.redirect("/urls");  // or /urls/new"?
});


//logout
app.post("/logout", (req, res) => {
  // const templateVars = { urls: urlDatabase,
  //   username: req.body.username };
  //res.cookie("username", req.body.username)
  res.clearCookie("user_id") 
  //console.log(req.body)
  res.redirect("/urls"); // or /urls/new"?
});


app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});