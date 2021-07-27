const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Autorization'
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const condidate = await User.findOne({email})
        if (condidate) {
            const areSame = await bcrypt.compare(password, condidate.password)
            if (areSame) {
                req.session.user = condidate
                req.session.isAuthenticated = true
                req.session.save((err) => {
                    if (err) throw err
                    res.redirect('/')
                })
            } else {
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }
    } catch(e) {
        console.log(e);
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, name, password, repeat} = req.body
        const condidate = await User.findOne({email})
    
        if (condidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashpassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashpassword, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }
    } catch(e) {
        console.log(e);
    }
})

module.exports = router