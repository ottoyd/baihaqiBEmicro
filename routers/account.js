const router = require('express').Router()
const { authentification } = require('../middlewares/auth')
const accountController = require('../controller/account')

router.use(authentification)

router.post('/login', accountController.accountLogin)
router.get('/lastLogin', accountController.getLastLogin)

module.exports = router