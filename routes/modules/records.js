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

// 新增頁
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, amount, categoryId } = req.body
  //若有未填欄位則導回新增頁
  if (!name || !date || !amount || !categoryId) {
    req.flash('warning_msg', '所有欄位都是必填!')
    return res.redirect(`/records/new`)
  }

  return Record.create({
    name,
    date,
    amount,
    userId,
    categoryId,
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯頁
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(err => console.log(err))
})

// 編輯
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, amount, categoryId } = req.body
  //若有未填欄位則導回編輯頁
  if (!name || !date || !amount || !categoryId) {
    req.flash('warning_msg', '所有欄位都是必填!')
    return res.redirect(`/records/${_id}/edit`)
  }

  return Record.findOne({ _id, userId })
    //.lean() 加了會出現錯誤!!猜測是因為後面的程序要操作資料庫，因而此時不能.lean()改變資料型態？
    .then(record => {
      record.name = name
      record.date = date
      record.amount = amount
      record.categoryId = categoryId
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 按種類查看消費記錄
router.get('/category', (req, res) => {
  const userId = req.user._id
  const { categoryId } = req.query
  // 從資料庫找出屬於"該使用者"且符合"指定類別"的消費資料
  Record.find({ userId, categoryId })
    .lean()
    .sort({ _id: 'asc' })
    .then(records => {

      let totalAmount = 0
      records.forEach(record => {
        // 計算總金額(該使用者在該"指定類別"中所支出的金額)
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