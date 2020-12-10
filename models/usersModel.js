const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    fName:{
        type: String,
        required: true
    },
    sName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    membership:{
        type: Boolean,
        required: true
    },
    admin:{
        type: Boolean,
       required: true
    }
})

module.exports = mongoose.model('User', usersSchema)