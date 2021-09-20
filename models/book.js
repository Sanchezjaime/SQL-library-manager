'use strict';
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  class Book extends Sequelize.Model {};
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          //error message
          msg: 'Please provide a "Title"'
        },
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          //error message
          msg: 'Please provide name of "Author"'
        },
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, { sequelize });
  return Book;
};
