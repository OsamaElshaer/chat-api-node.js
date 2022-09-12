//setup server
const express = require('express')
const app = express()

//require from project
const authRoutes = require('./routes/auth')
const dbConnection = require('./utils/database').dbConnection

//require packages
const dotenv = require('dotenv')


// enviroment variable
dotenv.config()


// midellware
app.use('', authRoutes)


const port = process.env.PORT

dbConnection(()=>{
    app.listen(port)
})
