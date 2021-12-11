// helper function find user by email
let checkUsers = function(email, users) {
  for (let ids in users) {
    if (users[ids].email === email) {
      return users[ids];
    }
  }
  return null;
};

//returns the URLs where the userID is equal to the id of the currently logged-in user.
const urlsForUser = function(userID, urlDatabase) {
  let usersURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      usersURLs[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return usersURLs;
};

//In order to simulate generating a "unique" shortURL, for now we will implement a function that returns a string of 6 random alphanumeric characters
const generateRandomString = (length = 8) => {
  return Math.random().toString(16).substring(2, length);
};
//console.log(generateRandomString(8));

module.exports = {
  checkUsers,
  urlsForUser,
  generateRandomString
};
