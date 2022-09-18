const {getIO } = require("../config/socket.io");
const {formatMessage} = require('./message')
const io = getIO()

class webSocket{
    constructor(username,room){
        this.username = username
        this.room = room
    }

    connection(){
        io.on('connection',socket=>{
            // when user join room 
            socket.emit('message',formatMessage('BOT',`Welecome ${this.username} to ${this.room} chat`))

            // make channel for room
            socket.join(this.room)

            // chat message
            socket.on('message',msg=>{
                io.to(this.room).emit('message',formatMessage(this.username,msg))
            })
            
            // to tell other users that user join this room
            socket.broadcast.to(this.room).emit('message',formatMessage('BOT',`${this.username} has join the chat`))

            // when user left chat
            socket.on('disconnect',()=>{
                io.to(this.room).emit('message',formatMessage('BOT',`${this.username} has left the ${this.room} chat`))
            })
        })
    }



}

exports.webSocket = webSocket













