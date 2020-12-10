// used to link with messages database
const MessagesModel = require('./../models/messagesModel')

// used to find the users name, which will be added to the message (ie author)
const Users = require('./../models/usersModel')

// Used to validate data from req body
const { body, validationResult } = require('express-validator');



// renders view/form to create a new message
const renderCreateMessage = (req,res)=>res.render('createMessageView', {errors: ''})

// Validates message form data and then creates a new message
const postCreateMessage = [
    // username must be an email
    body('title').trim().isLength({ min: 1 }).withMessage('Message must include a title'),
    // password must be at least 5 chars long
    body('message').trim().isLength({ max: 200 }).withMessage('Message can only be 200 characters long')
  ,
    // data checks and message creation
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.render('createMessageView', { errors: errors.array() });
        }

        // Get name of current user based off the user id
        try {
            let user = await Users.findById(req.params.id)
            let name = user.fName + ' ' + user.sName
            
            // if there are no errors, a message is created in the database
            let message = new MessagesModel({
                // Data from the form
                title: req.body.title,
                message: req.body.message,
                // name is pulled from the user data in DB
                userID: name 
            })
            try {
                message = await message.save()
                console.log(req.params.id);
                res.redirect('/user/'+req.params.id)
            } catch (error) {
                console.log(error);
                res.redirect('/user/'+req.params.id+'/create-message') 
            } 
        } catch (error) {
            console.log(error);
            res.redirect('/user/'+req.params.id+'/create-message')
        }
    }
]

// finds message and deletes using the req parameter messageID
const deleteMessage = async (req, res) =>{
    try {
       await MessagesModel.findByIdAndDelete(req.params.messageID)
       res.redirect("/user/"+req.params.id)
    } catch (error) {
        console.log(error);
        res.redirect("/user/"+req.params.id)
    }
}

module.exports = { renderCreateMessage, postCreateMessage, deleteMessage }