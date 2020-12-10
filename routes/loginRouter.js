const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const passport = require('../passportConfig')

// import controllers
const userController = require('./../controllers/userController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

// GET routes
router.get('/login', userController.renderUserLogin)
router.get('/sign-up', userController.renderUserSignUp)
router.get('/logout', userController.logoutUser)

// POST routes
router.post('/sign-up', userController.postUserSignUP)
router.post('/login', userController.postUserLogin)



module.exports = router;
