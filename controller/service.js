const { jwtTokenSign } = require('../libs/jwt')

const generateToken = async (req, res, next) => {
    try {

        const payload = {
            info: 'baihaqi',
        };

        const token = jwtTokenSign(payload, process.env.JWT_SECRET);

        console.log('generateToken, sukses');
        return res.status(200).json({ data: token })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    generateToken
}