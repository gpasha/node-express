const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Please enter a correct email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) return Promise.reject('This email have already existed')
            } catch(e) {
                console.log(e);
            }
        })
        .normalizeEmail(),
    body('password', 'The password should be more than 5 symbols')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('repeat')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('The passwords should be equal')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3}).withMessage('The name should be more than 2 symbols')
        .trim()
]