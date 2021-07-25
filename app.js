/**
 * Server dependencies.
 */
const express = require('express');
const cons = require('consolidate'); // Template library adapter for Express
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connection = require('./config/db.config.js');
const indexRouter = require('./routes/index');
const explorerRouter = require('./routes/explorer');

const app = express();
// Set Database connection
app.use(function(req,res,next){
  req.db = connection;
  next();
});

// view engine setup
app.engine('html', cons.underscore)
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/explorer', explorerRouter);

app.all('*', function(req, res) {
  res.status(400).json({'error': 'Bad request'});
});

// error handler
/* istanbul ignore next */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({'error': err});
});

module.exports = app;
