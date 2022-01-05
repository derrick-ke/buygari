const express = require('express')
const morgan = require('morgan')
const userRouter = require('./routes/userRouter')

const app = express()

app.use(express.json())

if(process.env.ENVIRONMENT !== "development") {
  app.use(morgan('combined'))
}

app.use('/api/v1/users', userRouter)

module.exports = app