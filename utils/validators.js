const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter valid email')
    .custom(async (value, req) => {
      try {
        const user = await User.findOne({email: value})
        if (user) {
          return Promise.reject('User is also exist')
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body('password', 'Password min 6 symbols')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('Password must be symbols')
      }
      return true
    })
    .trim(),
  body('name', 'Min 3 symbols')
    .isLength({min: 3})
    .trim()
]

exports.loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter valid email'),
  body('password', 'Password min 6 symbols')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim()
]

exports.courseValidators = [
  body('title', 'Minimum name 3 symbols')
    .isLength({min: 3})
    .trim(),
  body('price', 'Only number')
    .isNumeric(),
  body('img', 'Enter valid url')
    .isURL()
]