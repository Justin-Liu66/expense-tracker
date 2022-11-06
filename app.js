const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const routes = require('./routes')
const usePassport = require('./config/passport')
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
// passport
usePassport(app)
// flash
app.use(flash())
// 把req傳送給res
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
// router
app.use(routes)


app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})