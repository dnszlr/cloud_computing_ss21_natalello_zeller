const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// express app
const app = express();

// Database connect
// TODO remove password
const dbUri = "mongodb+srv://shaed:cc21gndz@shaeddb.v7gys.mongodb.net/ccShaed?retryWrites=true&w=majority";
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to ccShaedDB'))
    .catch((err) => console.log(err));

// ---------- Security ----------------

// implement the X-XSS-Protection header
// and force the header to be set to 1; mode = block
app.use((_req, res, next) => {
   res.setHeader("X-XSS-Protection", "1; mode=block");
   next();
});

// implement the X-Frame-Options (XFO) header
let xFrameOptions = require('x-frame-options');
const { compile } = require('ejs');
app.use(xFrameOptions());

// ------------- Security End ----------------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const loginRouter = require('./routes/loginR');
const registrationRouter = require('./routes/registrationR');
const chatRouter = require('./routes/chatR');
// Route usage
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);
app.use('/chat', chatRouter);
app.use((req, res, next) => {
   res.render('error');
});

module.exports = app;
