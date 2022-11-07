// 非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')

const categoryData = [
  { id: 1, name: '家居物業' },
  { id: 2, name: '交通出行' },
  { id: 3, name: '休閒娛樂' },
  { id: 4, name: '餐飲食品' },
  { id: 5, name: '其他' }
]

db.on(err, () => {
  console.log('mongodb error')
})

db.once('open', () => {
  Promise.all(
    categoryData.forEach(category => {
      Category.create(category)
    })
  )
  .then(() => {
    console.log('categoryseeder is done')
    process.exit()
  })

})