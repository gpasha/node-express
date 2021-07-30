const express = require('express')
const keys = require('./keys/index')
const path = require('path')
const csrf = require('csurf')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const helmet = require('helmet')
const compression = require('compression')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const home = require('./routers/home')
const add = require('./routers/add')
const courses = require('./routers/courses')
const card = require('./routers/card')
const orders = require('./routers/orders')
const auth = require('./routers/auth')
const profile = require('./routers/profile')
const errorHandler = require('./middleware/error')
const fileMiddlewear = require('./middleware/file')

/* START new setting express-handlebars */
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const app = express();

const MONGODB_URI = 'mongodb+srv://g_pavel:36bCGx5i4gcEQA2@cluster0.dpa5t.mongodb.net/shop'

const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs.helper')
})

const store = MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views')
/* END new setting express-handlebars */

app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true})) // to get data for POST method
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(fileMiddlewear.single('avatar'))

app.use(csrf())
app.use(flash())
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "*"],,
        "style-src": ["'self'", "cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css", "'unsafe-inline'"],
        "script-src": ["'self'", "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js", "'unsafe-inline'"]
      },
    },
  }))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)


app.use('/', home)
app.use('/add', add)
app.use('/courses', courses)
app.use('/card', card)
app.use('/orders', orders)
app.use('/auth', auth)
app.use('/profile', profile)


app.use(errorHandler)



const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log('error: ', e);
    }
}

start()
