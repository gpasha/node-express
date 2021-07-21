const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('courses', {
        title: 'Create a course',
        isAdd: true
    })
})

module.exports = router