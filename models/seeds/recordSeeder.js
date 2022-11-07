// 非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Record = require('../record')

db.once('open', () => {

  Array.from({ length: 10 }, (_, i) => {
    Record.create({
      name: `name-${i + 1}`,
      date: '2022.11.04',
      amount: '100'
    })
  })
  console.log('recordSeeder done!')
})