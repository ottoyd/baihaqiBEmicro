const express = require('express')
const app = express()
require('dotenv').config()

const routers = require('./routers/index')
const { errHandle } = require('./middlewares/errHandle')
const { database } = require('./middlewares/mongo')
const { redis } = require('./middlewares/redis')
const { log } = require('./middlewares/log')

app.use(express.json());


app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome,</h1>
        <p>Click the button below to view the Postman documentation:</p>
        <a href="https://github.com/ottoyd/baihaqi-betest/blob/main/BE_MICRO_BAIHAQI.postman_collection.json" class="btn btn-primary">Download Postman Collection</a>
        <h2>List Of API</h2>
        
        <p>GET /service/getToken</p>
        <p>GET /user/userInfoByAccountNumber/:num</p>
        <p>GET /user/userInfoByRegistrationNumber/:num</p>
        <p>POST /user/create</p>
        <p>PUT /user/edit/:userId</p>
        <p>DEL /user/delete/:userId</p>

        <p>POST /account/login</p>
        <p>GET /account/lastLogin</p>

        <h2>remember you need to get token from "/service/getToken"</h2>

        <h3>FORMATING :</h3>
        accountNumber: ACCNUM_YYYYMMDD_00001<br>
        registrationNumber: REGNUM_YYYYMMDD_00001<br>
        accountId: ACCID_YYYYMMDD_00001<br>
        userId: USRID_YYYYMMDD_00001<br>
        
        
    `);
})

app.use(database)
app.use(redis);
app.use(log)

app.use(routers)

app.use(errHandle)

module.exports = app