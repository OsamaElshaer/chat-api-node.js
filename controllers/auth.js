const {User} = require('../models/users')
const {getDb} = require('../config/database')

// require Packges
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendgridTransporter = require('nodemailer-sendgrid-transport')
const mongoDb = require('mongodb')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { validationResult } = require('express-validator')

require('dotenv').config()

// create trarsporter to send mails
const transporter = nodemailer.createTransport(sendgridTransporter({
    auth:{
        api_key:process.env.API_KEY
    }
}))


exports.singUp = (req,res,next)=>{
    email = req.body.email
    password = req.body.password.toString()
    const db = getDb()

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }
    db.
        collection('users')
        .find({email:email})
        .next()
        .then(user=>{
            if(user){
                return res.status(422).json({
                    message : 'email exist'
                })
            }
            
        bcrypt
            .hash(password,12,(err,hash)=>{
                if(err){
                    return res.status(422).json({
                        message:err
                    })
                }
                const user = new User(
                    email = email,
                    password = hash
                )
                user.save()

                const emailInfo =                     
                {
                    to:email,
                    from:process.env.EMAIL,
                    subject: 'signup succeeded',
                    html:'<h1> you are a member Now ! </h1>'
                }
                
                transporter.sendMail(emailInfo,(err,response)=>{
                        if(err){
                            console.log(err)
                            return res.status(503).json({
                                error:err,
                            })
                        }
                        res.status(201).json({
                            message:'you successfully signed up!',
                            mailResponse : response
                        })
                })   
            })
            })
            .catch((err)=>{
            res.status(500).json({
            message : err
            })
            })
}


exports.logIn = (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password.toString()
    const db = getDb()

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }
    db
        .collection('users')
        .findOne({email:email})
        .then(user=>{
            if(!user){
                return res.status(401).json({
                    message:'Email Dose Not Exist'
                })
            }
            bcrypt
                .compare(password,user.password,)
                .then(doMatch=>{
                    if(doMatch){
                        const token = jwt.sign(
                            {
                                userId:user._id,
                                email:email
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn:'1h'
                            }
                        )
                        return res.status(200).json({
                            message:'login successed',
                            token:token
                        })
                    }
                    return res.status(422).json({
                        message:'worng password',
                        
                    })
                })
                .catch(err=>{
                    res.status(422).json({
                        message:err
                    })
                })
        })
        .catch(err=>{
            res.status(404).json({
                message:err
            })
        })


}
exports.logOut = (req,res,next)=>{
    req.headers.authorization = ''
    res.status(404).json({
        message:"loged out"
    })
}
exports.resetPasswordEmail = (req,res,next)=>{
    const email = req.body.email
    const db = getDb()
    db 
        .collection('users').findOne({email:email})
        .then(user=>{
            if(!user){
                return res.status(404).json({
                    message:"email dos\'t exist"
                })
            }
            crypto.randomBytes(32,(err,buffer)=>{
                const resetToken = buffer.toString('hex')
                if(err){
                    return res.status(503).json({
                        message:"this service unavailable right now  "
                    })
                }
                user.token=resetToken
                user.tokenEpire = Date.now() + 36e5
                
                db.collection('users').updateOne({email:user.email},{$set:user})
                const emailInfo =                     
                    {
                        to:email,
                        from:process.env.EMAIL,
                        subject: 'Reset Password',
                        html:`<a href="http://localhost:3000/resetPassword/${resetToken}"> click here to reset your password </a>`
                    }
                transporter.sendMail(emailInfo,(err,response)=>{
                    if(err){
                        return res.status(503).json({
                            message:"this service unavailable right now ",
                            error:err
                        })
                    }
                    res.status(200).json({
                        message:"check your eamil to reset password",
                        response:response
                    })
                })
                })
        })
        .catch(err=>{
            return res.status(404).json({
                message:err
            })
        })
}
exports.resetPassword = (req,res,next)=>{
    const password = req.body.password.toString()
    const resetToken = req.params.token
    const db = getDb()
    db  
        .collection('users')
        .findOne({token:resetToken})
        .then(user=>{
            console.log(user)
            bcrypt.hash(password,10,(err,hashedPassword)=>{
                if(err){
                    return res.status(503).json({
                        error: err
                    })
                }
                db
                    .collection('users')
                    .updateOne({token:user.token},{$set:{password:hashedPassword}})
                    return res.status(200).json({
                        message: "reset password done"
                    })
            })
        })
        .catch(err=>{
            res.status(500).json({
                error : err
            })
        })
}
exports.deleteAccount = (req,res,next)=>{
    const userId = req.headers.user_id
    try{
        User
        .deleteById(new mongoDb.ObjectId(userId))
        return res.status(202).json({
            message: "Account Deleted"
        })
    }catch(err){
        res.status(503).json({
            error:err
        })
    }
}




























