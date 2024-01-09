const controller = require('../controllers/productions')
const { Router } = require('express')
const router = Router()

router.route('/')
    .get(controller.getProductions)
    .post(controller.createProduction)

router.route('/:id')
    .get(controller.getProductionById)
    .patch(controller.updateProduction)
    .delete(controller.deleteProduction)

router.route('/byCompany/:pcName')
    .get(controller.getProductionByPC)

module.exports = router