const { Router } = require('express')
const router = Router()

const controller = require('../controllers/calendarEvents')

router.route('/')
    .get(controller.getCalendarEvents)
    .post(controller.createCalendarEvent)

router.route('/pc/current')
    .get(controller.getCalendarEventsByPC)

router.route('/user/current')
    .get(controller.getCalendarEventsByUser)

router.route('/user/:id')
    .get(controller.getCalEventsByUserID)

router.route('/:id')
    .get(controller.getCalendarEventById)
    .patch(controller.updateCalendarEvent)
    .delete(controller.deleteCalendarEvent)

module.exports = router