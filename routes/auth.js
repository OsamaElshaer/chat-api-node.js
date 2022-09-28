
const express = require('express')
const router = express.Router()
const {check,body,validationResult} = require('express-validator')
const { getDb } = require('../config/database')


// require controllers
const authController = require('../controllers/auth')
const logger = require('../utils/logger')

// authentication routes
router.post(
            '/signup',
            body('email','Please enter a valid email address').isEmail().normalizeEmail().custom(async value=>{
                const user = await getDb().collection('users').findOne({email:value})
                if(user){
                    throw new Error(`${user.email} Email exist`)
                }
                return true;
            }),
            body('password','Pleas Entert the password with only numbers and thext and at least 8 characters').isLength({min:8}).isAlphanumeric(),
            body('passwordConfirm').custom((value,{req})=>{
                if(value !==req.body.password){
                    throw new Error('password have to match')
                }
                return true;
            }),
            authController.singUp
            )

router.post(
            '/login',
            body('email','Please enter a valid email address').isEmail().normalizeEmail(),
            body('password','inter avalid password').isLength({min:8}).isAlphanumeric(),
            authController.logIn
            )
router.post('/logout', authController.logOut)

router.post(
        '/resetPassEmail',
        body('email').isEmail().normalizeEmail(),
        authController.resetPasswordEmail
            )

router.patch(
            '/resetPassword/:token',
            body('password').isLength({min:8}).isAlphanumeric(),
            body('passwordConfirm').custom((value,{req})=>{
                if(value !== req.body.password){
                    throw new Error('password have to match')
                }
            }),
            authController.resetPassword
            )

router.delete('/deleteAccount', authController.deleteAccount)

router.get('/',authController.fetchAll)

module.exports = router;
