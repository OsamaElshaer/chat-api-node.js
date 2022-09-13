const {User} = require('../models/users')
const {getDb} = require('../utils/database')

// require Packges
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendgridTransporter = require('nodemailer-sendgrid-transport')
const mongoDb = require('mongodb')
const jwt = require('jsonwebtoken')


// create trarsporter to send mails
const transporter = nodemailer.createTransport(sendgridTransporter({
    auth:{
        api_key:'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'
    }
}))


exports.singUp = (req,res,next)=>{
    email = req.body.email
    password = req.body.password.toString()
    const db = getDb()
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
                res.status(201).json({
                    message:'you successfully signed up!',
                    mailResponse : response
                })
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
                            return;
                        }
                        //res.json({})
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

}
exports.resetPassEmail = (req,res,next)=>{

}
exports.resetPassword = (req,res,next)=>{

}
exports.deleteUser = (req,res,next)=>{

}


