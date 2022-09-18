const { Room } = require("../models/Rooms")
const { User } = require("../models/users")
const { getDb } = require("../config/database")
const mongodb = require('mongodb')

exports.create = async (req,res,next)=>{
    const roomName = req.body.roomName
    try{
        const room = new Room(roomName)
        room.create()
        return res.status(201).json({
            message:`Room ${roomName} has been created`
        })
    }
    catch(error){
        res.status(201).json({
            error:error
        })
    }   

}
exports.join = async (req,res,next)=>{
    const roomId = req.body.roomId
    const userId = req.headers.user_id

    try {
        const room = await Room.findById(roomId)
        const user = await User.findById(userId)
        room.users.push(user._id)
        // condition to valif=date if userroom still there
        user.rooms.push(room._id)
        Room.update(room._id,room)
        User.update(user._id,user)
        return res.status(201).json({
            message:'you have been joined this room'
        })
    }
    catch(error){
        res.status(500).json({
            error:"cant join this room right now please try again"
        })
    }  
}
exports.unjoin = async (req,res,next)=>{
    const roomId = req.body.roomId
    const userId = req.headers.user_id
    try {
        const user = await User.findById(userId)
        const room = await Room.findById(roomId)

        const roomList = user.rooms
        const userlist = room.users

        const roomIndex = roomList.findIndex(room=>room.toString()===new mongodb.ObjectId(roomId).toString())
        const userIndex = userlist.findIndex(user=>user.toString() === new mongodb.ObjectId(userId).toString())


        if(roomIndex  !== -1 && userIndex !== -1){
            roomList.splice(roomIndex,1)
            userlist.splice(userIndex,1)
            console.log(room)
            console.log(user)
            User.update(userId,user)
            Room.update(roomId,room)
            return res.status(201).json({
                message:'you have been unjoin this room'
            })
        }
        throw new Error()
    } catch (error) {
        return res.status(500).json({
            error:error,
            message:'You are already not unjoined this room'
        })
    }
}

exports.leave = async (req,res,next)=>{
    const roomId = req.body.roomId
    const userId = req.headers.user_id
    try {
        Room.leave(roomId,userId)
        return res.status(201).json({
            message:'you have been left this room'
        })
    } catch (error) {
        return res.status(500).json({
            error:error,
            message:'You are already not unjoined this room'
        })
    }
}

exports.delete = async (req,res,next)=>{
    const roomId = req.body.roomId
    const userId = req.headers.user_id
        Room.delete(roomId)
        await User
                .findById(userId)
                .then((user) => {
                    const roomList = user.rooms
                    const roomIndex = roomList.findIndex(room=>room.toString()===new mongodb.ObjectId(roomId).toString())
                    if(roomIndex  !== -1){
                        roomList.splice(roomIndex,1)
                        User.update(userId,user)
                        return res.status(201).json({
                            message:'you have been deleted this room'
                        })
                    }
                }).catch((error) => {
                    return res.status(500).json({
                        error:error,
                        message:'please try again'
                    }) 
                });
}

