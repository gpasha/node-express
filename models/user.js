const {Schema, model} = require('mongoose')

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }
            }
        ]
    }
})

user.methods.addToCart = function(course) {
    const items = [...this.cart.items]
    const courseIndex = items.findIndex(c => c.courseId.toString() === course._id.toString())

    if (courseIndex >= 0) {
        items[courseIndex].count = items[courseIndex].count + 1
    } else {
        items.push({
            count: 1,
            courseId: course._id
        })
    }

    this.cart = {items}
    return this.save()
}

module.exports = model('User', user)