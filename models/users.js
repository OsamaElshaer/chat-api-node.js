const {getDb} = require('../utils/database')
const mongodb = require('mongodb')

class User {
    constructor(email,password){
        this.email = email
        this.password = password
        this.token = null
    }

    save(){
        const db = getDb()
        db.collection('users').insertOne(this)
    }

    static deleteById(userId){
        const db = getDb()
        db.collection('users').deleteOne({_id:userId})
    }
}

exports.User = User