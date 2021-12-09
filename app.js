const express = require('express');
const morgan = require('morgan');

const carRouter = require('./routes/carRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

//MIDDLEWARE

app.use(morgan('dev'))

app.use(express.json())

//ROUTE HANDLERS


app.use('/api/v1/cars', carRouter)
app.use('/api/v1/users', userRouter)

module.exports = app