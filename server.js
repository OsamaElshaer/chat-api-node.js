//setup server
const express = require('express')
const app = express()

// enviroment variable
const dotenv = require('dotenv')
dotenv.config()

const testRoute = require('./routes/test')

// midellware
app.use('', testRoute)


const port = process.env.PORT
app.listen(port)