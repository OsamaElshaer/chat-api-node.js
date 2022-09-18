const express = require('express')
const router = express.Router()

const roomController = require('../controllers/room')

router.post('/create',roomController.create)
router.post('/join',roomController.join)
router.post('/unjoin',roomController.unjoin)
router.post('/leave',roomController.leave)
router.delete('/delete',roomController.delete)

module.exports = router;
