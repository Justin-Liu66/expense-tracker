const db = require('../../config/mongoose')
const Record = require('../record')

db.once('open', () => {

  Array.from({ length: 10 }, (_, i) => {
    Record.create({
      id: i + 1,
      name: `name-${i + 1}`,
      date: '2022.11.04',
      amount: '100'
    })
  })
  console.log('recordSeeder done!')
})