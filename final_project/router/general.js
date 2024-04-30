const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  if (userName && password) {
    users.map((user) => {
      if (user.userName === userName) {
        return res.status(404).json({ message: "user already exists" });
      }
    });
    users.push({ userName, password });
    return res.status(200).json({ message: "Registered successfully" });
  }
  return res.status(404).json({ message: "Something went wrong" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(300).json({ data: Object.values(books) });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const ISBNumber = req.params.isbn;
  return res.status(300).json({
    data:
      Object.keys(books).length > parseInt(ISBNumber) ? books[ISBNumber] : [],
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const newBooks = [];
  for (let key in books) {
    const tempBook = books[key];
    const authorArr = tempBook.author;
    if (authorArr.includes(author)) {
      newBooks.push(tempBook);
    }
  }
  return res.status(300).json({ data: newBooks });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleToSearch = req.params.title;
  const newBooks = [];
  for (let key in books) {
    const tempBook = books[key];
    const titleArr = tempBook.title;
    if (titleArr.includes(titleToSearch)) {
      newBooks.push(tempBook);
    }
  }
  return res.status(300).json({ data: newBooks });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json({
    data: Object.keys(books).length > isbn ? books[isbn].reviews : [],
  });
});

module.exports.general = public_users;
