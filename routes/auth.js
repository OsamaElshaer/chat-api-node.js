
const express = require('express')
const router = express.Router()

// require controllers
const authController = require('../controllers/auth')

// authentication routes
router.post('/signup', authController.singUp)

router.post('/login',  authController.logIn)
router.post('/logout', authController.logOut)

router.post('/resetPassEmail', authController.resetPasswordEmail)
router.patch('/resetPassword/:token', authController.resetPassword)

router.delete('/deleteAccount', authController.deleteAccount)



module.exports = router;
