const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Main page',
    isHome: true
  })
})

app.get('/add', (req, res) => {
  res.render('add', {
    title: 'New course',
    isAdd: true
  })
})

app.get('/courses', (req, res) => {
  res.render('courses', {
    title: 'List',
    isCourses: true
  })
})

const PORT = process.env.POST || 3000

app.listen(3000, () => {
  console.log(`Server is running on post ${PORT}`);
})