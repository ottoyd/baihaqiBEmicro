const router = require('express').Router()
const userController = require('../controller/user')

router.get('/userInfoByAccountNumber/:num', userController.userInfoByAccountNumber)
router.get('/userInfoByRegistrationNumber/:num', userController.userInfoByRegistrationNumber)

router.post('/create', userController.createUser)
router.put('/edit/:userId', userController.editUser)
router.delete('/delete/:userId', userController.deleteUser)
router.delete('/deleteTest/:emailAddress', userController.deleteUserTest)

module.exports = router