const createError = require('http-errors')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const indexRouter = require('./router')
const localhost = require('./LocalhostConnection')
// const bcrypt = require("bcryptjs")
localhost()


const app = express()

app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.use('/api', indexRouter)

app.use(function(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'
  res.status(err.statusCode).json({
    message: err.message
  })
})

const port = 5000
app.listen(port, function() {
  console.log(`Server is up and running on ${port}`)
})