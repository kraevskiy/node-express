const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('add', {
    title: 'New course',
    isAdd: true
  })
})

router.post('/', (req, res) => {
  console.log(req.body)

  res.redirect('/courses')
})

module.exports = router
