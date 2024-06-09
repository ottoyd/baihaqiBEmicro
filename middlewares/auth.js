let { verifyToken } = require('./../libs/jwt')

function authentification(req, res, next) {
    try {
        const decode = verifyToken(req.headers.authorization)
        if (decode) {
            next()
        }
    } catch (err) {
        return res.status(401).json({ 'msg': "Unauthorized" })
    }
}


module.exports = { authentification }