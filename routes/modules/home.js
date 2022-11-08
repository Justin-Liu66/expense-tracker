const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(records => {

      let totalAmount = 0
      records.forEach(record => {
        // 計算總金額(該用戶支出的所有項目)
        totalAmount += record.amount
        // 將日期轉換為yyyy/mm/dd
        record.date = record.date.toLocaleDateString()
      })
      res.render('index', { records, totalAmount })
    }
    )
    .catch(err => console.log(err))
})

module.exports = router

