const { Room } = require("../models/Rooms")
const { User } = require("../models/users")
const mongodb = require('mongodb')
const {formatMessage} = require('../utils/message')
const {getIO } = require("../config/socket.io")
const io = getIO()

const {validationResult}= require('express-validator')
const { application } = require("express")

exports.create = async (req,res,next)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }
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
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }
    let userName;
    let roomName;
    io.on('connection',async socket=>{
        try {
            const room = await Room.findById(roomId)
            const user = await User.findById(userId)
            userName = user.email.split('@')[0]
            roomName = room.name
            room.users.push(user._id)
            user.rooms.push(room._id)
            let arr=[];
            for (const id of user.rooms) {
                if (room._id.toString() === id.toString()) {
                    arr.push(id)
                }
            }
            // when user join room 
            socket.emit('message',formatMessage('BOT',roomName,`Welecome ${userName} to ${roomName} chat`))
            // make channel for room
            socket.join(roomName)
            // chat message
            socket.on('message',msg=>{
                io.to(roomName).emit('message',formatMessage(userName,roomName,msg))
            })
            // to tell other users that user join this room
            socket.broadcast.to(roomName).emit('message',formatMessage('BOT',roomName,`${userName} has join the chat`))
            // when user left chat
            socket.on('disconnect',()=>{
                    Room.leave(roomId,userId)
                    io.to(this.room).emit('message',formatMessage('BOT',roomName,`${userName} has left the ${roomName} chat`))
                    res.status(401).json({
                        error:'you have been left chat'
                    })
            })
            Room.update(room._id,room)
            if(arr.length<=1){
                User.update(user._id,user)
            }
        }
        catch(error){
            return res.status(500).json({
                error:error
            })
        } 
    })

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

