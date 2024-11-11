const bcrypt = require('bcrypt');

const hashPassword = (password) => {
    return new Promise((resovle, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err)
                }
                resovle(hash)
            })
        })
    })
}

const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

module.exports = {
    hashPassword,
    comparePassword
}