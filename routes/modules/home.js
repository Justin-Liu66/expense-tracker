const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

// icon 測試中
const categoryNum = {
  1: '家居物業',
  2: '交通出行',
  3: '休閒娛樂',
  4: '餐飲食品',
  5: '其他'
}

const CATEGORY = {
  家居物業: 'fa-solid fa-house',
  交通出行: 'fa-solid fa-van-shuttle',
  休閒娛樂: 'fa-solid fa-face-grin-beam',
  餐飲食品: 'fa-solid fa-utensils',
  其他: 'fa-solid fa-pen'
}

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
        // icon測試中!!!!!!!!
        const number = record.categoryId
        const categoryChinese = categoryNum[number]
        const icon = CATEGORY[categoryChinese]
        record.icon = icon 


      })
      res.render('index', { records, totalAmount })
    }
    )
    .catch(err => console.log(err))
})

module.exports = router

