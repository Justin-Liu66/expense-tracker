const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

// 登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  //註冊表單有空白的情況
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填!' })
  }
  //密碼與確認密碼不相符的情況
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符!' })
  }
  //若上述任一種情況存在，則重新渲染註冊頁並顯示提示
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個Email已經註冊過了!' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出!')
  res.redirect('/users/login')
})

module.exports = router