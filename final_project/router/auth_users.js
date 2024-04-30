const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  users.map((user) => {
    if (user.userName === username) return true;
  });
  return false;
};

const authenticatedUser = (username, password) => {
  users.map((user) => {
    if (user.userName === username && user.password === password) {
      return true;
    }
  });
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  if (userName && password) {
    users.map((user) => {
      if (user.userName === userName) {
        if (user.password === password) {
          return res.status(200).json({
            message: "success",
            token: jwt.sign(user.userName, "Private"),
          });
        } else {
          return res.status(404).json({ message: "Wrong credentials" });
        }
      }
    });
  }
  return res.status(300).json({ message: "Data missing" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userName = req.body.username;
  const review = req.body.review;
  const isbn = req.params.isbn;
  if (Object.keys(books).length < isbn) {
    return res
      .status(404)
      .json({ message: "Book with isbn: " + isbn + " does not exist" });
  }
  books[isbn].reviews.push({ userName: userName, review: review });
  return res.status(200).json({ message: "Success", data: books[isbn] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const userName = req.body.username;
  const isbn = req.params.isbn;
  if (Object.keys(books) < isbn) {
    return res
      .status(404)
      .json({ message: "Book with isbn: " + isbn + " does not exist" });
  }
  books[isbn].reviews = books[isbn].reviews.filter(
    (review) => review.userName !== userName
  );
  return res.status(200).json({ message: "Success", data: books[isbn] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
