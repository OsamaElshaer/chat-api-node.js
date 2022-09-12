const express = require('express')
const router = express.Router()

//controllers
const test = require('../controllers/test')

router.get('/',test.test)


module.exports = router;
