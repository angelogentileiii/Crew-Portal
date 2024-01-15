const controller = require('../controllers/users')
const { Router } = require('express')
const router = Router()

router.route('/')
    .get(controller.getUsers)
    // .post(controller.signupUser)

router.route('/currentUser')
    .get(controller.currentUser)

router.route('/availableUsers')
    .get(controller.getAvailableUsers)

router.route('/:id')
    .get(controller.getUserById)
    .patch(controller.updateUser)
    .delete(controller.deleteUser)

router.route('/currentUser/:username')
    .get(controller.getUserByUsername)

module.exports = router