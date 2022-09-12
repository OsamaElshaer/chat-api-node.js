//setup server
const express = require('express')
const app = express()

//require from project
const testRoute = require('./routes/test')
const dbConnection = require('./utils/database').dbConnection

//require packages
const dotenv = require('dotenv')


// enviroment variable
dotenv.config()


// midellware
app.use('', testRoute)



dbConnection(()=>{
    const port = process.env.PORT
    app.listen(port || 3000)
})
