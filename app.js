const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

const app = express()

// app中新增hbs引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// 正式掛載hbs
app.set('view engine', 'hbs')
// session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: 'false',
  saveUninitialized: true
}))

// body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'))
// router
app.use(routes)


app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})