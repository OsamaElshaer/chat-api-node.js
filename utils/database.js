const {MongoClient} = require('mongodb')

const url = 'mongodb://localhost:27017/chat_app'

const client = new MongoClient(url)


async function dbConnection(){
    await client.connect()
    const db = client.db('chat_app')
    return db
}

module.exports = dbConnection()
