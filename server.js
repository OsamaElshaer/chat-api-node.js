//setup server
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

//require from fiels
const dbConnection = require('./config/database').dbConnection
const {isAuth} = require('./middleware/isAuth')

//require packages
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors');
const path = require('path')
const {init} = require('./config/socket.io')
const io = init(server)

//require routes 
const authRoutes = require('./routes/auth')
const roomRoutes = require('./routes/room')


// parse body
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// enviroment variable
dotenv.config()

//cors
app.use(cors())




// midellware
app.use('/user', authRoutes)
app.use('/room', isAuth ,roomRoutes)

app.use(express.static(path.join(__dirname,'public')))

app.use('*',(req,res,next)=>{
    return res.status(404).json({
        error:"API endpoint not found"
    })
})


//socket

const port = process.env.PORT

dbConnection(()=>{
    server.listen(port)
})
