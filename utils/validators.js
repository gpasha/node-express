const {body} = require('express-validator')

exports.registerValidators = [
    body('email').isEmail().withMessage('Please enter a correct email'),
    body('password', 'The password should be more than 5 symbols').isLength({min: 6, max: 56}).isAlphanumeric(),
    body('repeat').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('The passwords should be equal')
        }
        return true
    }),
    body('name').isLength({min: 3}).withMessage('The name should be more than 2 symbols')
]