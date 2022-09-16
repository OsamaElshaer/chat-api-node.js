const { getDb } = require("../utils/database")
const mongodb = require('mongodb')

class Room{
    constructor(name){
        this.name = name
        this.users = []
        this.messages=[]
    }

    create(){
        getDb().collection('rooms').insertOne(this)
    }

    static update(roomId,obj){
        getDb().collection('rooms').updateOne({_id:new mongodb.ObjectId(roomId)},{$set:obj})
    }

    static delete(roomId){
        getDb().collection('rooms').deleteOne({_id:new mongodb.ObjectId(roomId)})
    }

    static findById(roomId){
        const db = getDb();
        return db.collection('rooms').findOne({_id:new mongodb.ObjectId(roomId)})
    
    }

}

exports.Room = Room