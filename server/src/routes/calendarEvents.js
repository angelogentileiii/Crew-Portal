const { Router } = require('express')
const router = Router()

const controller = require('../controllers/calendarEvents')

router.route('/')
    .get(controller.getCalendarEvents)
    .post(controller.createCalendarEvent)

router.route('/pc/:pcId')
    .get(controller.getCalendarEventsByPC)

router.route('/user/:userId')
    .get(controller.getCalendarEventsByUser)

router.route('/:id')
    .get(controller.getCalendarEventById)
    .patch(controller.updateCalendarEvent)
    .delete(controller.deleteCalendarEvent)

module.exports = router