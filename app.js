const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const reviewRouter = require('./routes/reviewRouter');

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(helmet());

if (process.env.ENVIRONMENT != 'development') {
  app.use(morgan('tiny'));
}

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Rate limit exceeded',
});

app.use('/api', limiter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
