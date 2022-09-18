const {MongoClient} = require('mongodb')

const url = 'mongodb://localhost:27017/'

const client = new MongoClient(url,{ useUnifiedTopology: true })

let db;

async function dbConnection(cb){
    await client.connect()
    db = client.db('chat_app')
    cb()
}

function getDb(){
    if(db){
        return db
    }
    throw new Error('can not reach to db')
}



exports.dbConnection = dbConnection
exports.getDb = getDb ;