const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.ENVIRONMENT === 'production') {
    cookieOptions.secure = true;
  }

  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstname: req.body.firstname,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });

  createToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //CHECK IF EMAIL AND PASSWORD EXIST
  if (!email || !password) {
    return next(new AppError('Please provide emai and password', 400));
  }
  //CHECK IF USERNAME AND PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //IF OKAY, SEND TOKEN TO USER
  createToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
  //Verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user exists
  const existingUser = await User.findById(decoded.id);

  if (!existingUser) {
    return next(new AppError('The user no longer exists', 401));
  }
  //Check if user changed password after token was issued
  if (existingUser.changedPassword(decoded.iat)) {
    next(new AppError('Your password has been changed. Please log in again'));
  }

  req.user = existingUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get the user based on the email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  //Generate random reset tokens
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to the user's email address
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Click the link ${resetURL} and follow the steps to reset your password. If you did not forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password reset Token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Unable to send reset token', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //Set new password if token is valid and user exists
  if (!user) {
    return next(new AppError('Token is not valid'), 400);
  }

  //Update changedPassword
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //Log in user
  res.status(200).json({
    status: 'success',
    message: 'Password has been updated successfully',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  console.log(req.user.id);

  //Get the user from collection
  const user = await User.findById(req.user.id).select('+password');

  //Check if password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Password is not correct'), 404);
  }

  //If so update password
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();
  //Log user in, send JWT
  createToken(user, 200, res);
});
