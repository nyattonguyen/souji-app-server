require('dotenv').config();
const catchAsyncErrors = require('./catchasyncerror');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

  const { token } = req.cookies;

  // console.log('token', token);
  if (!token) {
    return next(new ErrorHandler('Vui lòng đăng nhập để booking', 401));
  }

  const decodedToken = await jwt.verify(token, process.env.SECRET_KEY_TOKEN);

  const user = await User.findById(decodedToken.id);  

  if(!user) return res.send('Error')

  req.user = user
  next();
});

const authorizeRoles = () => {
  return (req, res, next) => {
    // console.log("req usser", req.user)
    if (req.user.isAdmin !== true) {
      return next(new ErrorHandler(`Role  is not allowed`));
    }

  next();
  };
};


module.exports = { isAuthenticatedUser, authorizeRoles };