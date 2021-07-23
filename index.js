const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const home = require('./routers/home')
const add = require('./routers/add')
const courses = require('./routers/courses')
const card = require('./routers/card')

/* START new setting express-handlebars */
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const app = express();

const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views')
/* END new setting express-handlebars */

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true})) // to get data for POST method

app.use('/', home)
app.use('/add', add)
app.use('/courses', courses)
app.use('/card', card)





const PORT = process.env.PORT || 3000

async function start() {
    try {
        // const url = 'mongodb+srv://g_pavel:36bCGx5i4gcEQA2@cluster0.dpa5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
        const url = 'mongodb+srv://g_pavel:36bCGx5i4gcEQA2@cluster0.dpa5t.mongodb.net/shop'
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch(e) {
        console.log('error: ', e);
    }
}

start()



