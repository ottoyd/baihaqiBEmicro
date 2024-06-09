const bcrypt = require('bcryptjs');

function bcryptPass(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

function compare(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = { bcryptPass, compare }