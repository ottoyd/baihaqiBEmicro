const { jwtTokenSign } = require('./../libs/jwt')
const Account = require('../models/account')
const User = require('../models/user')

const accountLogin = async (req, res, next) => {
    try {
        const { userName, password } = req.body
        const { db } = req

        const accountsLogin = await Account.login(userName, password, db)
        const userLogin = await User.getUserInfoByUserId(accountsLogin.userId, db)

        return res.status(200).json({
            data: {
                accessToken: jwtTokenSign(userLogin.userId),
                userInfo: new User({ ...userLogin }),
                accountInfo: new Account({ ...accountsLogin }),
            }
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
}
const getLastLogin = async (req, res, next) => {
    try {
        const { db } = req
        // THIS PROCESS CAN ALSO GET DATA FROM CACHE, FIND FROM JSON PARSED REDIS KEY
        const user = await Account.lastLogin(db)
        let result = []
        for (u of user) result.push(new Account(u))
        return res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    accountLogin,
    getLastLogin
}