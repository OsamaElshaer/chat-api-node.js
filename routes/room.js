const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const { getDb } = require('../config/database')
const mongodb = require('mongodb')
const roomController = require('../controllers/room')

router.post(
    '/create',
    check('roomName').custom(async roomName=>{
        const room =await getDb().collection('rooms').findOne({name:roomName})
        if(room){
            throw new Error('room name exist')
        }
        return true;
                
    }),
    roomController.create)

router.post(
    '/join',
    check('roomName').custom(async (value,{req})=>{        
        const user = await getDb().collection('users').findOne({email:req.body.email})
        const room = await getDb().collection('rooms').findOne({name:value})
        for (const id of room.users) {
                if(id.toString() === user._id.toString()){
                    throw new Error('you are already joined')
                }
                return true;
        }
        
    }),
    roomController.join)

router.post('/unjoin',roomController.unjoin)
router.delete('/delete',roomController.delete)

module.exports = router;
