const keys = require('../keys/index')

module.exports = function(email) {
    return {
        to: email,
        subject: 'New account was created!',
        html: `
            <h1>Welcome to our online store!</h1>
            Your account was successfully created with email:<strong> ${email}</strong>
            <hr/>
            <a href="${keys.BASE_URL}" target="_blank">Our online store</a>
        `
    }
}