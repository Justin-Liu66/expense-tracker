const mongoose = require('mongoose')
const Record = require('../record')

// 非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection
db.on ('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
  Array.from({ length: 10 }, (_, i) => {
    Record.create({
      id: i + 1,
      name: `name-${i}`,
      date: '2022.11.04',
      amount: '100'
    })
  })
})