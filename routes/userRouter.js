const express = require('express')
const router = express.Router()

// import controllers
const userController = require('./../controllers/userController')
const messageController = require('./../controllers/messageController')


// GET routes
router.get('/', userController.renderUserHome)
router.get('/:id', userController.renderUserHome)
router.get('/:id/member', userController.renderBecomeMember)
router.get('/:id/admin', userController.renderBecomeAdmin)
router.get('/:id/create-message', messageController.renderCreateMessage)

// POST routes
router.post('/:id/create-message', messageController.postCreateMessage)

// These are GET requests beacuse I didn't want to redesign / force a PUT action on a form. The GET requests below call userController methods that act as proxy PUT requests to update the DB.
router.put('/:id/become-member', userController.updateUserMembership)
router.put('/:id/become-admin', userController.updateUserAdmin)

// DELETE routes
router.delete('/:id/:messageID/delete', messageController.deleteMessage)

module.exports = router