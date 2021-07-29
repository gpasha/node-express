const {Router} = require('express')
const crypto = require('crypto')
// const mongoose = require('mongoose')
const {validationResult} = require('express-validator')
const {registerValidators} = require('../utils/validators')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const keys = require('../keys/index')
const nodemailer = require('nodemailer')
const registrationEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')

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

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, name, password, repeat} = req.body
        const condidate = await User.findOne({email})

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
    
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

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Something went wrong! Please repeat it later!')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'The email is wrong!')
                res.redirect('/auth/reset')
            }
        })

    } catch(e) {
        console.log(e);
    }

})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
        
        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Access recovery',
                error: req.flash('error'),
                userId: user._id.toString('hex'),
                token: req.params.token
            })
        }

    } catch(e) {
        console.log(e);
    }
})

router.post('/password', async (req, res) => {
    try {
        // const _id = mongoose.Schema.Types.ObjectId(req.body.userId);
        const user = await User.findOne({
            // _id,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetToken = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('error', 'The token was expired!')
            res.redirect('/auth/login')
        }
    } catch(e) {
        console.log(e);
    }
})

module.exports = router