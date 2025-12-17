const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const user = users.find((u) => u.username === username);

return !user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find((u) => u.username === username && u.password === password);
return !!user;
}

// only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // 1. Pflichtfelder prüfen
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // 2. Zugangsdaten prüfen
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
  
    // 3. JWT erzeugen
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  
    // 4. Token in der Session speichern
    req.session.authorization = {
      accessToken,
      username
    };
  
    return res.status(200).json({ message: "User successfully logged in" });
  });
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
