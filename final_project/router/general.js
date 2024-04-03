const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user.  Username and Password not both provided."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  const booksAsStr = await JSON.stringify(books);
  return res.status(200).json(booksAsStr);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let bookByIsbn = await books[req.params.isbn];
  if (bookByIsbn !== undefined) {
    return res.status(200).json(JSON.stringify(bookByIsbn));
  } else {
    return res.status(400).json("Non-existent ISBN");
  }
 });

 const findBookByAuthor = (bookKeys, books, author) => {
    for (let n = 0; n < bookKeys.length; n++) {
        if (author === books[bookKeys[n]]['author']) {
            bk = books[bookKeys[n]];
            break;
        }
    }
    return bk;
}
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let bookKeys = Object.keys(books);
  const bk = await findBookByAuthor(bookKeys, books, req.params.author);

  if (bk !== undefined) {
    return res.status(200).json(JSON.stringify(bk));
  } else {
    return res.status(400).json("Non-existent author");
  }
});

const findBookByTitle = (bookKeys, books, title) => {
    for (let n = 0; n < bookKeys.length; n++) {
        if (title === books[bookKeys[n]]['title']) {
            bk = books[bookKeys[n]];
            break;
        }
    }
    return bk;
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let bookKeys = Object.keys(books);
  const bk = await findBookByTitle(bookKeys, books, req.params.title);

  if (bk !== undefined) {
    return res.status(200).json(JSON.stringify(bk));
  } else {
    return res.status(400).json("Non-existent author");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let bookByIsbn = books[req.params.isbn];
  if (bookByIsbn !== undefined) {
    return res.status(200).json(JSON.stringify(bookByIsbn['reviews']));
  } else {
    return res.status(400).json("Non-existent ISBN");
  }
});

module.exports.general = public_users;
