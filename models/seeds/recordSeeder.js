const bcrypt = require('bcryptjs')

// 非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')


const seedUser = [
  {
    name: '廣志',
    email: 'user1@example.com',
    password: '12345678',
    seedRecordIndex: [0, 1, 2, 4]
  },
  {
    name: '小新',
    email: 'user2@example.com',
    password: '12345678',
    seedRecordIndex: [3]
  },
]

const seedRecord = [
  {
    name: '午餐',
    date: '2019.4.23',
    amount: '60',
    categoryId: '4',
  },
  {
    name: '晚餐',
    date: '2019.4.23',
    amount: '60',
    categoryId: '4',
  },
  {
    name: '捷運',
    date: '2019.4.23',
    amount: '120',
    categoryId: '2',
  },
  {
    name: '電影:驚奇隊長',
    date: '2019.4.23',
    amount: '220',
    categoryId: '3',
  },
  {
    name: '租金',
    date: '2015.4.01',
    amount: '25000',
    categoryId: '1',
  },
]

db.once('open', () => {
  Promise.all(
    //依序建立兩位種子使用者
    Array.from({ length: 2 }, (_, i) => {
      const { name, email, password } = seedUser[i]
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        })
          .then(user => {
            //每建立一位種子使用者，就從seedUser中拿出該使用者的seedRecordIndex，並使用.map處理其中的每一筆index
            const records = seedUser[i].seedRecordIndex.map(index => {
              //使用index將該筆消費記錄從seedRecord中抓出來
              const record = seedRecord[index]
              //將該筆消費記錄綁上該種子使用者的user_id
              record.userId = user._id
              return record
            })
            //在Record Model中建立所有屬於該種子使用者的消費記錄
            return Record.create(records)
          })
          .catch(err => console.log('create seedRecord error!'))
        )
        .catch(err => console.log('bcrypt error'))
    })
  )
    .then(() => {
      console.log('recordSeeder done!')
      process.exit()
    })
    .catch(err => console.log(err))
})
