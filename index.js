const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.POST || 3000

async function start() {
  try {
    const url = 'mongodb+srv://rambutan:tvmz6OECZbQzeASN@cluster0-mhhnb.mongodb.net/test?retryWrites=true&w=majority'
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(3000, () => {
      console.log(`Server is running on post ${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
}

start()



