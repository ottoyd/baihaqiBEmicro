## Installation
npm install

## Local ENV
PORT=3000

JWT_SECRET=BAIHAQI

MONGO_HOST=ottoyd xxxxxx true&w=majority

REDIS_URL=rediss:// xxxxxxx 0545.upstash.io:30545

## Runing in your local
npm run dev

## Unit test
npm run test

## List Of API
GET /service/getToken

GET /user/userInfoByAccountNumber/:num

GET /user/userInfoByRegistrationNumber/:num

POST /user/create

PUT /user/edit/:userId

DEL /user/delete/:userId

POST /account/login

GET /account/lastLogin

remember you need to get token from "/service/getToken"

