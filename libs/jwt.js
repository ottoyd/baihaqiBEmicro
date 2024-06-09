const jwt = require('jsonwebtoken');

function jwtTokenSign(text) {
    return jwt.sign(text, process.env.JWT_SECRET);
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { jwtTokenSign, verifyToken }