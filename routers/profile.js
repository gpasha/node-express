const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()
const User = require('../models/user')

router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req, res) => {
    try {
        console.log('req.body: ', req.body)
        const user = await User.findById(req.user._id)
        console.log('user: ', user)

        const toChange = {
            name: req.body.name
        }

        if (req.file) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch(e) {
       console.log(e);
    }
})

module.exports = router