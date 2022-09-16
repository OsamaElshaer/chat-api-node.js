const {getDb} = require('../utils/database')
const mongodb = require('mongodb')

class User {
    constructor(email,password){
        this.email = email
        this.password = password
        this.token = null
        this.rooms = []
    }

    save(){
        const db = getDb()
        db.collection('users').insertOne(this)
    }

    static update(userId,obj){
        getDb().collection('users').updateOne({_id:new mongodb.ObjectId(userId)},{$set:obj})
    }

    static deleteById(userId){
        const db = getDb()
        db.collection('users').deleteOne({_id:userId})
    }

    static findById(userId){
        const db = getDb()
        return db.collection('users').findOne({_id:new mongodb.ObjectId(userId)})    
    }

}

exports.User = User