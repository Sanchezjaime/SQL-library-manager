const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Sequelize = require('sequelize');

/* Handler function to wrap each route */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      //forward error to the global error handler in app.js using next() method
      next(error);
    }
  }
}

//home route redirect to /books route
router.get('/', asyncHandler(async(req, res,next) => {
  res.redirect("/books");
}));

//shows full list of books
router.get('/books', asyncHandler(async(req, res, next) => {
  //asynchronously gets all books and stores in books variable
  const books = await Book.findAll();
  res.render('index', {books, title: "Library Database"})
}));

//shows the create new book form
router.get('/books/new', asyncHandler(async(req, res, next) => {
    res.render('new-book', {book:{}, title: "New Book"})
}));

//posts new book to the database
router.post('/books/new',asyncHandler(async(req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/" );
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {book, errors: error.errors, title: "New Book"})
      } else {
        throw error;
      }
    }
}));

//shows selected book detail and redirects to update form
router.get('/books/:id',asyncHandler(async(req, res, next) => {
    const book = await Book.findByPk(req.params.id);
      res.render('update-book', {book, title: 'Edit Book' + book.title, id:req.params.id});
}));

//updates book info in the Database
router.post('/books/:id',asyncHandler(async(req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if(book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', { book, errors: error.errors, title: 'Edit Book'})
      } else {
        throw error;
      }
    }
}));

//deletes a book
router.post('/books/:id/delete',asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
      await book.destroy();
      res.redirect("/");
    } else {
      res.sendStatus(404);
    }
}));

module.exports = router;
