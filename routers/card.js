const {Router} = require('express')
const course = require('../models/course')
const Course = require('../models/course')

const router = Router()

function mapCartItems(cart) {
    return cart.items.map(item => ({
        ...item.courseId._doc, count: item.count
    }))

}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()
    
    const courses = mapCartItems(user.cart)

    res.render('card', {
        title: 'Basket',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    })
})

router.delete('/remove/:id', async (req, res) => {
    const card = await Card.remove(req.params.id)
    res.status(200).json(card)
})

module.exports = router