
const  moment = require('moment');
const { Message } = require('../models/messages');

exports.formatMessage = (username,roomName,text)=>{
    const time = moment().format('h:mm a') 
    const message = new Message(username,roomName,text,time)
    message.save()
    return {
        username,
        roomName,
        text,
        time: time
    };
}

