const router = require('express').Router()
const userRouter = require('./user')
const serviceRouter = require('./service')
const acccountRouter = require('./account')

const { authentification } = require('./../middlewares/auth')

router.use('/service', serviceRouter)


router.use(authentification)
router.use('/user', userRouter)
router.use('/account', acccountRouter)


module.exports = router