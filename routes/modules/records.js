const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

// 新增頁
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, amount, categoryId } = req.body
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

//按種類查看消費記錄
router.get('/category', (req, res) => {
  const userId = req.user._id
  const { categoryId } = req.query
  //從資料庫找出屬於"該使用者"且符合"指定類別"的消費資料
  Record.find({ userId, categoryId })
    .lean()
    .sort({ _id: 'asc' })
    .then(records => {
      //計算總金額(該使用者在該"指定類別"中所支出的金額)
      let totalAmount = 0
      records.forEach(record => {
        totalAmount += record.amount
      })
      res.render('index', { records, totalAmount })
    }
    )
    .catch(err => console.log(err))
})

module.exports = router