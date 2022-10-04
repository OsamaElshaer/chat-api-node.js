const jwt = require('jsonwebtoken')

exports.isAuth = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        req.headers.userId = decoded.userId
        next()
    }catch(err){
        return res.status(401).json({
            message:'login failed resign in'
        })
    }
}