const {getDb} = require('../utils/database')
const mongodb = require('mongodb')

class User {
    constructor(username, email,){
        this.username=username,
        this.email = email
    }

    save(){
        getDb().collection('users').insertOne(this)
    }

    static getAll(){
        getDb().collection('users').find()
    }

    static getById(id){
        getDb().collection('users').findOne({id:new mongodb.ObjectId(id)})
    }

    static deleteById(id){
        getDb().collection('users').deleteOne({id:new mongodb.ObjectId(id)})
    }

}

exports.User = User