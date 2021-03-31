const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// Mongoose
const mongoose = require('mongoose');
// Routes
const loginRouter = require('./routes/loginR');
const loginController = require('./controllers/loginC');
const registrationRouter = require('./routes/registrationR');
const chatRouter = require('./routes/chatR');

// express app
const app = express();

// Database connect
const dbUri = "mongodb+srv://shaed:cc21gndz@shaeddb.v7gys.mongodb.net/ccShaed?retryWrites=true&w=majority";
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to ccShaedDB'))
    .catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// Route usage
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);
app.use('/chat', chatRouter);

/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});*/

/*// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
