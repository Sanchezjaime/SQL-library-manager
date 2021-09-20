var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//require method to import instance of sequelize
const sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established');
  } catch (error) {
    console.log('Connection is not established');
  }

  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.log('Unable to sync with database', error);
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = createError(404);
  next(err)
});

//error handler
app.use((err, req, res, next) => {
  res.locals.error= err;

  if (err.status === 404) {
    res.status(err.status);
    err.message = "Sorry! we could not find the page you were looking for."
    console.log(err.message);
    return res.render('page-not-found', {err});
  } else {
    err.status = 500;
    res.status(err.status);
    err.message = "Sorry! there was an unexpected error on the server."
    console.log(err.message);
    return res.render('error', {err});
  }
});


module.exports = app;
