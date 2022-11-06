const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
module.exports = app => {
  // 初始化passport
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy(
    { usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          //若無符合的使用者
          if (!user) {
            return done(null, false, { message: 'That email is not registered!' })
          }
          //若密碼不正確
          if (user.password !== password) {
            return done(null, false, { message: 'Email or Password incorrect!' })
          }
          //找到符合的使用者
          return done(null, user)
        })
        .catch(err => done(err, false))
    }
  ))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id) ////問題: 為何不是user._id?
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}