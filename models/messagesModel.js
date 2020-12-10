const mongoose = require('mongoose')

const messagesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    message:{
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', messagesSchema)