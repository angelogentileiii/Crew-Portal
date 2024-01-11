const controller = require('../controllers/auth')
const { Router } = require('express')
const router = Router()

router.route('/signupUser')
    .post(controller.signupUser)

router.route('/loginUser')
    .post(controller.loginUser)

router.route('/signupPC')
    .post(controller.signupPC)

router.route('/loginPC')
    .post(controller.loginPC)

router.route('/refreshToken')
    .post(controller.refreshTokens)

router.route('/decodeToken')
    .post(controller.decodeToken)

module.exports = router