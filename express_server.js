const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; //default port

//Making data readable for humans
app.use(bodyParser.urlencoded({extended: true})); //
app.use(cookieParser());

//In order to simulate generating a "unique" shortURL, for now we will implement a function that returns a string of 6 random alphanumeric characters
const generateRandomString = (length = 8) => {
  return Math.random().toString(16).substring(2, length);
};

// find user by email
let checkUsers = function (email) {
  for (let ids in users) {
    if(users[ids].email === email) {
      return users[ids];
    }
}
return null;
}

//console.log(generateRandomString(8));

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
  const userID = req.cookies["user_id"];
  console.log("old",urlDatabase);
  urlDatabase[shortURL] = {longURL, userID};
  console.log("new",urlDatabase);
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
  console.log("request",req.params)
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]] };
  // if unauthorized login redirect to login page, other users and go to urls_new
    if(!templateVars.user) {
      res.redirect("/login");
    } else {
      res.render("urls_new", templateVars);
    }
});

// Creates shortened URL, created a map for urlDatabase
//req.params will return parameters in the matched route.
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]] };
    
    if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
      res.render("urls_show", templateVars);
    } else {
      return res.status(401).send('unauthorized user');
    }
  
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


 app.post("/register", (req, res) => {
    // need to add new user to users object
  //id, email, password --> generateRandomString
  
 const newEmail = req.body.email;
 const newPassword = req.body.password;
  const user = checkUsers(newEmail)
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

app.post("/login", (req, res) => {
const email = req.body.email;
const password = req.body.password;

//console.log(users[newUserId]);
//console.log(users, newUser);

const user = checkUsers(email)
if (! user || user.password !== password) {
  return res.status(403).send('invalid credentials');
} 


  //console.log(newUser);

res.cookie('user_id', user.id);
res.redirect("/urls");  
});



//logout
app.post("/logout", (req, res) => {

  res.clearCookie("user_id") 
  //console.log(req.body)
  res.redirect("/urls"); 
});


app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});

