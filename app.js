// loads environment variables
require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const flash = require('connect-flash')

// db set up - uses enviroment variable
mongoose.connect( process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})

// route initialisation 
const loginRouter = require('./routes/loginRouter');
const userRouter = require('./routes/userRouter')

// app initialisation
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// allows form methods to be over-ridden (useful for DELETE/PUT requests)
app.use(methodOverride('_method'))

// additonal app features
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport initialization
app.use(session({secret:'cat', saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())




// allows views access to curentUser and error variables
app.use(function(req, res, next) {
  res.locals.flash = req.flash('error')
  res.locals.currentUser = req.user;
  next();
});



// routes
app.use('/', loginRouter);
app.use('/user', userRouter)


module.exports = app;
