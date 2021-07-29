const keys = require('../keys/index')

module.exports = function(email, token) {
    return {
        to: email,
        subject: 'Access recovery',
        html: `
            <h1>Did you forget your password?</h1>
            <p>If<strong> NOT</strong>: please ignore the email</p>
            <p>If<strong> YES</strong>: please click on the link bellow</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Access recovery</a></p>
            <hr/>
            <a href="${keys.BASE_URL}" target="_blank">Our online store</a>
        `
    }
}