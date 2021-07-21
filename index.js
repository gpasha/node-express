const express = require('express')
const exphbs = require('express-handlebars')
const home = require('./routers/home')
const add = require('./routers/add')
const courses = require('./routers/courses')
const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true})) // to get data for POST method

app.use('/', home)
app.use('/add', add)
app.use('/courses', courses)





const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})