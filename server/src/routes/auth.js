const controller = require('../controllers/auth')
const { Router } = require('express')
const router = Router()

router.route('/signup')
    .post(controller.signupUser)

router.route('/login')
    .post(controller.loginUser)

router.route('/refreshToken')
    .post(controller.refreshTokens)

module.exports = router