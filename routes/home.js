const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Main page',
    isHome: true
  })
})

module.exports = router
