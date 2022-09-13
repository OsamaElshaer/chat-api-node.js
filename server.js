//setup server
const express = require('express')
const app = express()

//require from fiels
const dbConnection = require('./utils/database').dbConnection
const {isAuth} = require('./middleware/isAuth')

//require packages
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors');

//require routes 
const authRoutes = require('./routes/auth')


// parse body
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// enviroment variable
dotenv.config()

//cors
app.use(cors())




// midellware
app.use('', authRoutes)


const port = process.env.PORT

dbConnection(()=>{
    app.listen(port)
})
