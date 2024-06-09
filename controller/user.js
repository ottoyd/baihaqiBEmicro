const Err = require('./../libs/err')
const User = require('../models/user')
const Account = require('../models/account');
const { ObjectId } = require('mongodb');

const { getNextSequenceValue } = require('./../libs/helper');

const userInfoByAccountNumber = async (req, res, next) => {
    try {
        const { num } = req.params
        const { redis, db } = req
        // Cache
        const userInfo = await redis.get(`GET_${num}`);
        if (userInfo) {
            console.log('Cache hit for userInfoByAccountNumber:', num);
            return res.status(200).json({ data: new User(JSON.parse(userInfo)) });
        }
        const user = await User.getUserInfoByAccountNumber(num, db)
        await redis.set(`GET_${num}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
        return res.status(200).json({ data: new User(user) })
    } catch (error) {
        next(error)
    }
}
const userInfoByRegistrationNumber = async (req, res, next) => {
    try {
        const { num } = req.params
        const { redis, db } = req
        // Cache
        const userInfo = await redis.get(`GET_${num}`);
        if (userInfo) {
            console.log('Cache hit for userInfoByRegistrationNumber:', num);
            return res.status(200).json({ data: new User(JSON.parse(userInfo)) });
        }
        const user = await User.getUserInfoByRegistrationNumber(num, db, redis)
        await redis.set(`GET_${num}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
        return res.status(200).json({ data: new User(user) })
    } catch (error) {
        console.log(error);
        next(error)
    }
}
const createUser = async (req, res, next) => {
    try {
        const { redis, db } = req

        const createUserData = {
            fullName: req.body.fullName,
            emailAddress: req.body.emailAddress,
        }

        const createAccountData = {
            password: req.body.password,
            userName: req.body.userName
        }

        const isEmailUnique = await User.findByEmail(createUserData.emailAddress, db)
        const isUsernameUnique = await Account.findByUserName(createAccountData.userName, db)
        if (isEmailUnique) throw new Err('Email Already taken ', 400)
        if (isUsernameUnique) throw new Err('UserName Already taken ', 400)

        const generateData = {
            userId: new ObjectId(),
            accountNumber: await getNextSequenceValue('ACCNUM', redis),
            registrationNumber: await getNextSequenceValue('REGNUM', redis),
            accountId: await getNextSequenceValue('ACCID', redis),
            userId: await getNextSequenceValue('USRID', redis),
            lastLoginDate: null,
        }
        const resultCreateUser = await User.create(createUserData, db, generateData)
        const resultCreateAccount = await Account.create(createAccountData, db, generateData)

        return res.status(201).json({ data: { userInfo: resultCreateUser, accountInfo: resultCreateAccount } })
    } catch (error) {
        next(error)
    }
}
const editUser = async (req, res, next) => {
    try {
        const { redis, db } = req
        let editUserData = {}
        let editAccountData = {}
        // Optional Logic
        if (req.body.fullName) editUserData.fullName = req.body.fullName
        if (req.body.emailAddress) editUserData.emailAddress = req.body.emailAddress
        if (req.body.oldPassword) editAccountData.oldPassword = req.body.oldPassword
        if (req.body.newPassword) editAccountData.newPassword = req.body.newPassword

        const { userId } = req.params

        // await User.edit(editUserData, userId, db)
        // await Account.edit(editAccountData, userId, db)
        // only do if edit requested

        const thisUser = await db.collection("users").findOne({ userId });

        if (!thisUser) throw new Err('User Not Found', 404)

        if (Object.keys(editUserData).length > 0) {
            await User.edit(editUserData, userId, db)
        }
        if (Object.keys(editAccountData).length > 0) {
            await Account.edit(editAccountData, userId, db)
        }

        // CAN BE UPDATE REDIS KEY

        redis.del(`GET_${thisUser.registrationNumber}`)
        redis.del(`GET_${thisUser.accountNumber}`)

        // return res.status(200).json({ data: { ...editUserData, ...editAccountData } })
        return res.status(200).json({ data: { msg: 'Edit Sukses' } })
    } catch (error) {
        console.log(error);
        next(error)
    }
}
const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { redis, db } = req
        const deletedUser = await User.delete(userId, db)
        await Account.delete(userId, db)
        redis.del(`GET_${deletedUser.registrationNumber}`)
        redis.del(`GET_${deletedUser.accountNumber}`)
        return res.status(200).json({ data: { msg: 'Delete Sukses' } })
    } catch (error) {
        next(error)
    }
}
const deleteUserTest = async (req, res, next) => {
    try {
        const { emailAddress } = req.params
        const { redis, db } = req
        const deletedUserTest = await db.collection("users").findOne({ emailAddress })
        await db.collection("users").deleteOne({ emailAddress })
        await db.collection("accounts").deleteOne({ userId: deletedUserTest.userId })
        redis.del(`GET_${deletedUserTest.registrationNumber}`)
        redis.del(`GET_${deletedUserTest.accountNumber}`)
        return res.status(200).json({ data: { msg: 'Delete Sukses' } })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    userInfoByAccountNumber,
    userInfoByRegistrationNumber,
    createUser,
    editUser,
    deleteUser,
    deleteUserTest
}