
const events = require('events');
const { Audit } = require('../models/audit');
const emitter = new events.EventEmitter()
const {getDb} = require('../config/database')

emitter.on('audit' , function(audit){
    // steps of actions - save into db
    console.log("Audit Event Emitter - Audit : " + JSON.stringify(audit));
    try {

        const db = getDb()
        db.collection('audits').insertOne(audit)
        
    } catch (error) {
        console.log("Audit Event Emitter - error : " + error);
    }
});

exports.createAudit = (auditAction , data , error , auditBy , auditOn)=>{
    let status =200
    if(err)
        status=500
    const auditObj = new Audit(auditAction , data , status , error , auditBy , auditOn)
    emitter.emit('audit',auditObj)
}