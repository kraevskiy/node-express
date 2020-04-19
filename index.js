const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5e9b40f061a9b8066b4f2fa8')
    req.user = user
    next()
  } catch (e) {
    console.log(e);
  }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.POST || 3000

async function start() {
  try {
    const url = 'mongodb+srv://rambutan:tvmz6OECZbQzeASN@cluster0-mhhnb.mongodb.net/shop'
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'dsik-web@ukr.net',
        name: 'Illia',
        cart: {items: []}
      })
      await user.save()
    }
    app.listen(3000, () => {
      console.log(`Server is running on post ${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
}

start()



