const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')

// 首頁
router.use('/', home)

// records
router.use('/records', records)

module.exports = router