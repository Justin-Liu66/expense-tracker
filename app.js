const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')

const app = express()

// 非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// 連線MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
// 取得連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// app中新增hbs引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// 正式掛載hbs
app.set('view engine', 'hbs')
// body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'))
// router
app.use(routes)


app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})