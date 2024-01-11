const controller = require('../controllers/productionCompanies')
const { Router } = require('express')
const router = Router()

router.route('/')
    .get(controller.getProductionCompanies)

router.route('/currentUser')
    .get(controller.getCurrentPC)

router.route('/:id')
    .get(controller.getProductionCompanyById)
    .patch(controller.updateProductionCompany)
    .delete(controller.deleteProductionCompany)


module.exports = router