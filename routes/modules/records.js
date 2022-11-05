const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

// 新增頁
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增
router.post('/', (req, res) => {
  const { name, date, amount, category } = req.body
  return Record.create({
    name,
    date,
    amount,
    category
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 編輯頁
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(err => console.log(err))
})

// 編輯
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, amount, category } = req.body
  return Record.findById(id)
    //.lean() 加了會出現錯誤!!猜測是因為後面的程序要操作資料庫，因而此時不能.lean()改變資料型態？
    .then(record => {
      record.name = name
      record.date = date
      record.amount = amount
      record.category = category
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router