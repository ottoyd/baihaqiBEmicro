require('dotenv').config()
const app = require('../index')
const request = require('supertest')
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvIjoiYmFpaGFxaSIsImlhdCI6MTcxMjQ0NTY0M30.nPhYtOFfg0T-376ppy1DF1XlUjBF_pMdzrSW1yq9mh0'

// MOCKUP
const userRegister = {
    "fullName": "abi115",
    "userName": "abi7725",
    "emailAddress": "abi35222@gmail.com",
    "password": "544455"
}

let dataCreated = {}

describe('=== INITIAL DELETE ===', () => {
    describe('POST /user/deleteTest', () => {
        test('INITIAL DELETE', done => {
            request(app)
                .delete(`/user/deleteTest/${userRegister.emailAddress}`)
                .set('authorization', token)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    } else {
                        return done()
                    }
                })
        })
    })
})
describe('=== USER TEST ===', () => {
    describe('Success create POST /user/create', () => {
        test('should return 201', done => {
            request(app)
                .post('/user/create')
                .set('authorization', token)
                .send(userRegister)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    } else {
                        expect(res.status).toBe(201)
                        expect(res.body.data.userInfo).toHaveProperty('fullName', userRegister.fullName)
                        expect(res.body.data.accountInfo).toHaveProperty('userName', userRegister.userName)
                        expect(res.body.data.accountInfo).not.toHaveProperty('password')
                        dataCreated = res.body.data
                        return done()
                    }
                })
        })
    })

    describe('Duplicate create POST /user/create', () => {
        test('should return Error status 400', done => {
            request(app)
                .post('/user/create')
                .set('authorization', token)
                .send(userRegister)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    } else {
                        expect(res.status).toBe(400)
                        return done()
                    }
                })
        })
    })

    describe('USER INFO BY AccountNumber GET /user/userInfoByAccountNumber', () => {
        test('should return 200', done => {
            request(app)
                .get(`/user/userInfoByAccountNumber/${dataCreated.userInfo.accountNumber}`) // Ensure the correct URL construction
                .set('authorization', token)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } else {
                        expect(res.status).toBe(200)
                        expect(res.body.data).toHaveProperty('userId', dataCreated.userInfo.userId);
                        expect(res.body.data).toHaveProperty('fullName', dataCreated.userInfo.fullName);
                        expect(res.body.data).toHaveProperty('accountNumber', dataCreated.userInfo.accountNumber);
                        expect(res.body.data).toHaveProperty('emailAddress', dataCreated.userInfo.emailAddress);
                        expect(res.body.data).toHaveProperty('registrationNumber', dataCreated.userInfo.registrationNumber);
                        return done();
                    }
                });
        });
    });

    describe('USER INFO BY RegistrationNumber GET /user/userInfoByRegistrationNumber', () => {
        test('should return 200', done => {
            request(app)
                .get(`/user/userInfoByRegistrationNumber/${dataCreated.userInfo.registrationNumber}`) // Ensure the correct URL construction
                .set('authorization', token)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    } else {
                        expect(res.status).toBe(200)
                        expect(res.body.data).toHaveProperty('userId', dataCreated.userInfo.userId);
                        expect(res.body.data).toHaveProperty('fullName', dataCreated.userInfo.fullName);
                        expect(res.body.data).toHaveProperty('accountNumber', dataCreated.userInfo.accountNumber);
                        expect(res.body.data).toHaveProperty('emailAddress', dataCreated.userInfo.emailAddress);
                        expect(res.body.data).toHaveProperty('registrationNumber', dataCreated.userInfo.registrationNumber);
                        return done();
                    }
                });
        });
    });
})

describe('=== ACCOUNT TEST ===', () => {
    describe('Success Login POST /account/login', () => {
        test('should return 200', done => {
            request(app)
                .post('/account/login')
                .set('authorization', token)
                .send({
                    "userName": userRegister.userName,
                    "password": userRegister.password,
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    } else {
                        expect(res.status).toBe(200)
                        expect(res.body.data).toHaveProperty('userInfo')
                        expect(res.body.data).toHaveProperty('accountInfo')
                        expect(res.body.data).toHaveProperty('accessToken')
                        return done()
                    }
                })
        })
    })

    describe('Success lastLogin GET /account/lastLogin', () => {
        test('should return 200', done => {
            request(app)
                .get('/account/lastLogin')
                .set('authorization', token)
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    } else {
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('data')
                        expect(Array.isArray(res.body.data)).toBe(true)
                        expect(res.body.data.length).toBeGreaterThan(0)
                        res.body.data.forEach(account => {
                            expect(account).toHaveProperty('_id')
                            expect(account).toHaveProperty('accountId')
                            expect(account).toHaveProperty('userName')
                            expect(account).toHaveProperty('lastLoginDate')
                            expect(account).toHaveProperty('userId')
                            expect(account).not.toHaveProperty('password')
                        })
                        return done()
                    }
                })
        })
    })

    describe('Success Change Password /user/edit', () => {
        test('should return 200', done => {
            request(app)
                .put(`/user/edit/${dataCreated.userInfo.userId}`)
                .set('authorization', token)
                .send({
                    "oldPassword": userRegister.password,
                    "newPassword": '222222',
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    } else {
                        expect(res.status).toBe(200)
                        return done()
                    }
                })
        })
    })

    describe('Success Invalid Login After Password Changed POST /account/login', () => {
        test('should return 400', done => {
            request(app)
                .post('/account/login')
                .set('authorization', token)
                .send({
                    "userName": userRegister.userName,
                    "password": userRegister.password,
                })
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    } else {
                        expect(res.status).toBe(400)
                        return done()
                    }
                })
        })
    })
    
})
