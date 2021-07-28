const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const keys = require('../keys/index')
const nodemailer = require('nodemailer')
const registrationEmail = require('../emails/registration')

let transporter = nodemailer.createTransport(
    {
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: keys.EMAIL,
            pass: keys.APPLICATION_PASSWORD_FROM_MAIL_RU
        }
    },
    {
        from: `From Node JS <${keys.EMAIL}>`
    }
)


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        isLogin: true,
        title: 'Autorization',
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
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
                req.flash('loginError', 'Not correct login or password!')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'This user is not consist!')
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
            req.flash('registerError', 'This user is consist!')
            res.redirect('/auth/login#register')
        } else {
            const hashpassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashpassword, cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
            await transporter.sendMail(registrationEmail(user.email))

        }
    } catch(e) {
        console.log(e);
    }
})

module.exports = router