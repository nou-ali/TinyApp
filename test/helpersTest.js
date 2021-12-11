const { assert } = require('chai');

const { checkUsers } = require('../helper.js');

const testUsers = {
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

describe('checkUsers', function() {
  it('should return a user with valid email', function() {
    const user = checkUsers("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user,testUsers.userRandomID);
  });

  it('should return undefined if the email provided is not valid', function() {
    const user = checkUsers("user3@example.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user,expectedOutput);
  });

});


