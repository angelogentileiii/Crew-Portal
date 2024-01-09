const controller = require('../controllers/productionCompanies')
const { Router } = require('express')
const router = Router()

router.route('/')
    .get(controller.getProductionCompanies)
    .post(controller.createProductionCompany)

router.route('/:id')
    .get(controller.getProductionCompanyById)
    .patch(controller.updateProductionCompany)
    .delete(controller.deleteProductionCompany)

module.exports = router