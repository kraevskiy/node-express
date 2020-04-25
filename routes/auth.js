const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
const sendgrig = require('nodemailer-sendgrid-transport')
const User = require('../models/user')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const {registerValidators, loginValidators} = require('../utils/validators')
const router = Router()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(keys.SENDGRID_API_KEY)
const transporter = nodemailer.createTransport(sendgrig({
  auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Sign In',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError'),
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  })
})

router.post('/login', loginValidators, async (req, res) => {
  try {
    const {email, password} = req.body
    const candidate = await User.findOne({email})

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#login')
    }
    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password)

      if (areSame) {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) {
            throw err
          } else {
            res.redirect('/')
          }
        })
      } else {
        req.flash('loginError', 'Check email/password')
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginError', 'User not found')
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/register', registerValidators, async (req, res) => {
  try {
    const {email, password, name} = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({
      email, name, password: hashPassword, cart: {items: []}
    })
    await user.save()
    res.redirect('/auth/login#login')
    await sgMail.send(regEmail(email))
  } catch (e) {
    console.log(e)
  }
})

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Reset Password',
    error: req.flash('error')
  })
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('auth/login')
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    })
    if (!user) {
      return res.redirect('auth/login')
    } else {
      res.render('auth/password', {
        title: 'New password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }
  } catch (e) {
    console.log(e)
  }
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong. Please repeat!')
        return res.redirect('/auth/reset')
      }

      const token = buffer.toString('hex')
      const candidate = await User.findOne({email: req.body.email})

      if (candidate) {
        candidate.resetToken = token
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
        await candidate.save()
        await sgMail.send(resetEmail(candidate.email, token))
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Incorrect email')
        res.redirect('/auth/reset')
      }
    })
  } catch (e) {
    console.log(e)
  }
})


router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      req.flash('loginError', 'Time token error, pls try one more time')
      res.redirect('/auth/login')
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
