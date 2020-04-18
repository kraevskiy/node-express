const {Router} = require('express')
const Card = require('../models/card')
const Course = require('../models/course')
const router = Router()

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id)
  await Card.add(course)
  res.redirect('/card')
})

router.get('/', async (req, res) => {
  const card = await Card.fetch()
  res.render('card', {
    title: 'Card',
    isCard: true,
    courses: card.courses,
    price: card.price
  })
})

module.exports = router