const { getDb } = require("../config/database")
const mongodb = require('mongodb')

class Room{
    constructor(name){
        this.name = name
        this.users = []
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
    static async leave(roomId,userId){

        
            const room = await Room.findById(roomId)
            const userlist = room.users
            const userIndex = userlist.findIndex(user=>user.toString() === new mongodb.ObjectId(userId).toString())
            if(userIndex !== -1){
                userlist.splice(userIndex,1)
                Room.update(roomId,room)
            }
    }

}

exports.Room = Room