// used to render message-board
const Messages = require('./../models/messagesModel')

// used to create new users
const User = require('./../models/usersModel')

// Used to validate data from req body
const { body, validationResult } = require('express-validator');

// used to encrpyt passwords
const bcrypt = require('bcryptjs')

// imports passport that was configured in passportConfig file
const passport = require('../passportConfig')


// renders 'home' message board. Currenntly using place-holder messages
const renderUserHome = async (req, res)=>{
    // retrieves all the messages from the database
    try {
        const messages = await Messages.find()
        // all the messages are passed to the userView page
        res.render('userView', {messages: messages, user: req.user})
    } catch (error) {
        console.log(error);
    }

    
}

// renders views after a GET request
const renderUserLogin = (req, res)=>res.render('loginView.ejs')
const renderUserSignUp = (req, res)=>res.render('signUpView.ejs', {errors: ''})
const renderBecomeMember = (req,res)=>res.render('becomeMemberView.ejs')
const renderBecomeAdmin = (req,res)=>res.render('becomeAdminView.ejs')

// validates and then creates a new user on a sign-up POST request
const postUserSignUP = [

    // validation checks
    body('fName').trim().exists().isLength({ min: 1 }).withMessage('A First name is required'),
    body('sName').trim().exists().isLength({ min: 1 }).withMessage('A Second name is required'),
    body('email').trim().exists().withMessage('An email address is required'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address'),
    body('password').trim().isLength({min: 8}).withMessage('Password must be at least 8 characters long'),

    // data checks and message creation
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req)
        if( !errors.isEmpty()){
            // any errors are displayed through the dataError.ejs partial
           return res.render('signUpView', {errors: errors.array()})
        }

        try {  

            //  checks to see if an email address has already been registered
            const users = await User.find()
            const userCheck = users.find(user =>user.username === req.body.email)
            
            // if the email is already in use
            if(userCheck){
                return res.render('signUpView', 
                {errors: [{msg:'That email address has already been used'}]})
            }
            
            // creates a new user
            else{
                // hashes a password to be added to created user
                bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        // if there are no errors a new user is created
                        let user = new User({
                            fName: req.body.fName,
                            sName: req.body.sName,
                            email: req.body.email,
                            username: req.body.email,
                            password: hashedPassword,
                            membership: false,
                            admin: false
                        })
                        try {
                            // user is saved (created) to Datebase
                            user = user.save()
                            console.log('new user made');
                            res.redirect('/login')
        
                            // any errors are displayed through the dataError.ejs partial
                        } catch (error) {
                            console.log(error);
                            res.render('signUpView', {errors: error})
                        }
                    }
                })
            }
        } 
        catch (error) {
            console.log(error);
            return res.render('signUpView', 
                {errors: [{msg:'There was an error on sign up'}]})
        }
    }
]

// preforms an authentication check on the username and password submitted in the post request
const postUserLogin = (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/user',
        failureRedirect: '/login',
        failureFlash: 'Incorrect Username or Password'
    }, 
    )
    
 

    (req, res, next);
}



// Logs out user and redirects to login page
const logoutUser = (req, res) =>{
    req.logout();
    res.redirect("/");
}

// updates a users membership field
const updateUserMembership = async (req, res) =>{
    // finds users in DB
    try {
        let user = await User.findById(req.params.id)
        // updates user membership
        user.membership = true
        try {
            // saves updated user and redirects to message-board (user should see aditional content now)
            user = await user.save()
            res.redirect('/user/'+req.params.id)
        } catch (error) {
            // redirects to membership page on error
            console.log(error);
            res.redirect('/user/'+req.params.id+'member')
        }
    } catch (error) {
        // redirects to membership page on error
        console.log(error);
        res.redirect('/user/'+req.params.id+'member') 
    }   
}

// updates a users admin field
const updateUserAdmin = async (req, res) =>{
    // finds users in DB
    try {
        let user = await User.findById(req.params.id)
        // updates user membership
        user.admin = true
        try {
            // saves updated user and redirects to message-board (user should see aditional content now)
            user = await user.save()
            res.redirect('/user/'+req.params.id)
        } catch (error) {
            // redirects to admin page on error
            console.log(error);
            res.redirect('/user'+req.params.id+'/admin')
        }

    } catch (error) {
        // redirects to admin page on error
        console.log(error);
        res.redirect('/user'+req.params.id+'/admin')
    }


}

module.exports = { renderUserLogin, renderUserSignUp, renderUserHome, renderBecomeMember, renderBecomeAdmin, postUserSignUP, postUserLogin, logoutUser, updateUserMembership, updateUserAdmin }