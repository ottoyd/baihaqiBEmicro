const router = require('express').Router()
const serviceController = require('./../controller/service')

router.get('/getToken', serviceController.generateToken)

module.exports = router