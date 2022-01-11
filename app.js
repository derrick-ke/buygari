const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');

const app = express();

app.use(express.json());

if (process.env.ENVIRONMENT != 'development') {
  app.use(morgan('tiny'));
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

module.exports = app;
