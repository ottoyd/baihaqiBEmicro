const Err = require('../libs/err')
const { compare, bcryptPass } = require('./../libs/bycrypt')

class Account {
    constructor({ _id, accountId, userName, lastLoginDate, userId }) {
        this._id = _id // AUTO GEN
        this.accountId = accountId.trim() // AUTO GEN
        this.userName = userName.trim()
        // this.password = password.trim()
        this.lastLoginDate = lastLoginDate // AUTO GEN
        this.userId = userId.trim() // AUTO GEN
    }

    static async findByUserName(userName, db) {
        const user = await db.collection('accounts').findOne({ userName });
        return user;
    }

    static async create(data, db, generatedData) {
        const { password, userName } = data;
        if (!password) throw new Err('password Is Required', 400)
        if (!userName) throw new Err('userName Is Required', 400)

        const accountCollection = db.collection("accounts")

        const createAccount = {
            _id: null,
            accountId: generatedData.accountId,
            userName,
            password: bcryptPass(password),
            lastLoginDate: generatedData.lastLoginDate,
            userId: generatedData.userId
        };
        await accountCollection.insertOne(createAccount)

        return new Account(createAccount)
    }

    static async edit(data, userId, db) {
        try {
            const accountCollection = db.collection("accounts")
            const { oldPassword, newPassword } = data;

            const thisAccount = await accountCollection.findOne({ userId });
            if (!thisAccount) throw new Err('Account Not Found', 404)
            if (!compare(oldPassword, thisAccount.password,)) throw new Err('Wrong Old Password', 404)
            if (compare(newPassword, thisAccount.password)) throw new Err('Please Choose diferent Password', 404)

            const dataEditAccount = { password: bcryptPass(newPassword) };
            const filter = { userId };
            const update = { $set: dataEditAccount };
            await accountCollection.updateOne(filter, update);

            return thisAccount

        } catch (error) {
            throw error
        }
    }

    static async delete(userId, db) {
        try {
            const accountCollection = db.collection("accounts")
            const thisAccount = await accountCollection.findOne({ userId });
            if (!thisAccount) throw new Err('Account Not Found', 404)

            await accountCollection.deleteOne({ userId })
            return thisAccount

        } catch (error) {
            throw error
        }
    }

    static async login(userName, password, db) {
        try {
            const accountCollection = db.collection("accounts")

            const thisAccount = await accountCollection.findOne({ userName });
            if (!thisAccount) throw new Err('Invalid Credential', 400)
            if (!compare(password, thisAccount.password)) throw new Err('Invalid Credential', 400)

            const dataEditAccount = { lastLoginDate: new Date() };
            const filter = { userName };
            const update = { $set: dataEditAccount };
            await accountCollection.updateOne(filter, update);

            return thisAccount

        } catch (error) {
            throw error
        }
    }

    static async lastLogin(db) {
        try {
            const collection = db.collection('accounts');
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const recentLogins = await collection.find({
                lastLoginDate: { $gte: threeDaysAgo }
            }).toArray();
            return recentLogins;

        } catch (error) {
            throw error
        }
    }
}
module.exports = Account