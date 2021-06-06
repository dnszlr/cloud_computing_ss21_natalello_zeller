const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const helmet = require('helmet');

// express app
const app = express();

// Database connect
// TODO remove password
const dbUri = "mongodb+srv://shaed:cc21gndz@shaeddb.v7gys.mongodb.net/ccShaed?retryWrites=true&w=majority";
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to ccShaedDB'))
    .catch((err) => console.log(err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, '/public')));
//---------------- SECURITY ---------------
app.use(function (req, res, next) {
   res.setHeader(
       'Content-Security-Policy',
       "default-src 'none'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'unsafe-inline'; frame-src 'self'; form-action 'self'"
   );
   next();
});

app.use(helmet());
// implement the X-XSS-Protection header
// and force the header to be set to 1; mode = block
app.use((_req, res, next) => {
   res.setHeader("X-XSS-Protection", "1; mode=block");
   next();
});

app.enable('trust proxy');
app.use(function(req,res, next) {
   let host = req.headers.host;
   console.log(req.headers);
   if(!(host.includes('localhost') || req.protocol === 'https')) {
      res.redirect('https://' + req.headers.host + req.url);
   } else {
      next()
   }
});
//---------------- SECURITY END ---------------

// Routes
const loginRouter = require('./routes/loginR');
const registrationRouter = require('./routes/registrationR');
const chatRouter = require('./routes/chatR');
const mobileRouter = require('./mobileHelper/mobileR');
// Route usage
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);
app.use('/chat', chatRouter);
app.use('/mobile', mobileRouter);
app.use((req, res, next) => {
   res.render('error');
});

module.exports = app;
