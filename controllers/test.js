const getDb = require('../utils/database.js').getDb

exports.test = (req,res,next)=>{

    getDb().collection('u').insertOne({name:'osama'})
    res.send('<h1>welcome</h1>')
}