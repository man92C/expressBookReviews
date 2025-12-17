const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ==== Promise-Helper für Tasks 10–13 ====

const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
};

const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const result = [];
    for (const isbn in books) {
      const book = books[isbn];
      if (book.author === author) {
        result.push(book);
      }
    }
    if (result.length > 0) {
      resolve(result);
    } else {
      reject("Author not found");
    }
  });
};

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const result = [];
    for (const isbn in books) {
      const book = books[isbn];
      if (book.title === title) {
        result.push(book);
      }
    }
    if (result.length > 0) {
      resolve(result);
    } else {
      reject("Title not found");
    }
  });
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  const userExists = users.some((user) => user.username === username);

  if(userExists){
    return res.status(409).json({message: "User already exists"});
  }

  users.push({username,password});

  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop (async/await)
public_users.get('/', async function (req, res) {
    try {
      const booksList = await getBooks();        // Promise auflösen
      return res.status(200).json(booksList);    // JSON zurückgeben
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books", error: err });
    }
  });
  

// Get book details based on ISBN (async/await)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
      const book = await getBookByISBN(isbn);
      return res.status(200).json(book);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  
  
// Get book details based on author (async/await)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const booksByAuthor = await getBooksByAuthor(author);
      return res.status(200).json(booksByAuthor);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

// Get book details based on title (async/await)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
      const booksByTitle = await getBooksByTitle(title);
      return res.status(200).json(booksByTitle);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];

  if(book && book.reviews){
    return res.status(200).json(book.reviews);
  } else if (book) {
    return res.status(200).json({});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
