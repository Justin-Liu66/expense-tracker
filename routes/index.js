const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')

// 首頁
router.use('/', home)
// records
router.use('/records', records)
// users
router.use('/users', users)

module.exports = router