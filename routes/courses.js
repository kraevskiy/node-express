const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('courses', {
    title: 'List',
    isCourses: true
  })
})

module.exports = router
