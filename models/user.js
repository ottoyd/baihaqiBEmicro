const { ObjectId } = require('mongodb');
const Account = require('./account');
const Err = require('./../libs/err')
const { bcryptPass } = require('./../libs/bycrypt')


class User {
    constructor({ _id, userId, fullName, accountNumber, emailAddress, registrationNumber }) {
        this._id = _id
        this.userId = userId.trim() // AUTO GEN
        this.fullName = fullName.trim()
        this.accountNumber = accountNumber.trim()// AUTO GEN
        this.emailAddress = emailAddress.trim()
        this.registrationNumber = registrationNumber.trim() // AUTO GEN
    }

    static async findByEmail(emailAddress, db) {
        const user = await db.collection('users').findOne({ emailAddress });
        return user;
    }

    static async getUserInfoByUserId(userId, db) {
        const user = await db.collection('users').findOne({ userId });
        return user;
    }

    static async getUserInfoByAccountNumber(accountNumber, db) {
        const user = await db.collection('users').findOne({ accountNumber });
        return user;
    }

    static async getUserInfoByRegistrationNumber(registrationNumber, db, redis) {
        let userInfo = await redis.get(`GET_${registrationNumber}`);
        if (userInfo) {
            console.log('Cache hit for registrationNumber:', registrationNumber);
            return JSON.parse(userInfo);
        }
        const user = await db.collection('users').findOne({ registrationNumber });
        if (user) await redis.set(`GET_${registrationNumber}`, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
        return user;
    }

    static async create(data, db, generatedData) {
        try {

            const { fullName, emailAddress } = data;
            if (!fullName) throw new Err('fullName Is Required', 400)
            if (!emailAddress) throw new Err('emailAddress Is Required', 400)

            const userCollection = db.collection("users")

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) throw new Err('Invalid email address', 400)

            const createUser = {
                _id: null,
                userId: generatedData.userId,
                fullName,
                accountNumber: generatedData.accountNumber,
                emailAddress,
                registrationNumber: generatedData.registrationNumber,
            };

            await userCollection.insertOne(createUser)
            return new User(createUser)

        } catch (error) {
            throw error
        }
    }

    static async edit(data, userId, db) {
        try {
            const userCollection = db.collection("users")
            const { fullName, emailAddress } = data;

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) throw new Err('Invalid email address', 400)

            const dataEditUser = { fullName, emailAddress };
            const filter = { userId };
            const update = { $set: dataEditUser };
            await userCollection.updateOne(filter, update);

            return dataEditUser

        } catch (error) {
            throw error
        }
    }

    static async delete(userId, db) {
        try {
            const userCollection = db.collection("users")
            const thisUser = await userCollection.findOne({ userId });
            if (!thisUser) throw new Err('User Not Found', 404)

            await userCollection.deleteOne({ userId })
            return thisUser

        } catch (error) {
            throw error
        }
    }
}
module.exports = User