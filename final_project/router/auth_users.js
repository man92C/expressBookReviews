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
  

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;               // Review-Text aus Query
    const username = req.session.authorization && req.session.authorization.username;
  
    // 1. Prüfen, ob User eingeloggt und Review vorhanden
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    // 2. Buch holen
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // 3. Reviews-Objekt initialisieren, falls nicht vorhanden
    if (!book.reviews) {
      book.reviews = {};
    }
  
    // 4. Review des aktuellen Users setzen/überschreiben
    book.reviews[username] = review;
  
    return res.status(200).json({ message: "Review successfully added/modified", reviews: book.reviews });
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization && req.session.authorization.username;
  
    // 1. prüfen, ob eingeloggt
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review by this user not found" });
    }
  
    // 2. Review dieses Users löschen
    delete book.reviews[username];
  
    return res.status(200).json({ message: "Review deleted", reviews: book.reviews });
  });  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
