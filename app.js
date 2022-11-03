const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

app.get('/', (req, res) => {
  res.send('hello new project')
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})