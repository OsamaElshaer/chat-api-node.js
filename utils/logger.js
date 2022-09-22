const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf,colorize} = format;



const myFormat = printf(({ level, message, timestamp ,data}) => {
    if (data){
        message = `${message} | ${JSON.stringify(data)}`
    }
    return `${timestamp}  ${level}: ${message}`
})

const logger = createLogger({
    format:combine(
        // colorize(),
        timestamp(),
        myFormat
    ),
    transports: [new transports.File({filename:'logs/logs.log'})]
});


exports.logger = logger

