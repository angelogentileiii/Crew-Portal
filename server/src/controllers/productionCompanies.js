const ProductionCompany = require('../models/productionCompanies')

/////////////////////
// standard routes //
/////////////////////
const getProductionCompanies = async (req, res, next) => {
    try {
        const productionCompanys = await ProductionCompany.findAll();
        return res.status(200).json(productionCompanys)
    }
    catch (error) {
        return res.status(404).json({error: error.message});
    }
}

const getProductionCompanyById = async (req, res, next) => {
    try{
        // findByPk means find by primary key (aka id)
        const productionCompany = await ProductionCompany.findByPk(req.params.id)
        return res.status(200).json(productionCompany)
    }
    catch (error) {
        return res.status(404).json({error: error.message})
    }
}

const createProductionCompany = async (req, res, next) => {
    try {
        const modelAttributes = Object.keys(ProductionCompany.rawAttributes);

        const validKeys = Object.keys(req.body).filter((key) => {
            return modelAttributes.includes(key)
        })

        const newProductionCompany = validKeys.reduce((accum, key) => {
            accum[key] = req.body[key]
            return accum
        }, {})

        try {
            const productionCompany = await ProductionCompany.create(newProductionCompany);
            return res.status(201).json(productionCompany)
        }
        catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const updateProductionCompany = async (req, res, next) => {
    try {
        const modelAttributes = Object.keys(User.rawAttributes);

        const validKeys = Object.keys(req.body).filter((key) => {
            return modelAttributes.includes(key)
        })

        const productionCompanyModel = validKeys.reduce((accum, key) => {
            accum[key] = req.body[key]
            return accum
        }, {})

        try {
            const [_, updatedProductionCompany] = await ProductionCompany.update(productionCompanyModel, {
                where: {id: req.params.id},
                returning: true
            })

            if (updatedProductionCompany) {
                return res.status(200).json(updatedProductionCompany)
            } else {
                return res.status(404).json({message: "ProductionCompany not found."})
            }
        }
        catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
    catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deleteProductionCompany = async (req, res, next) => {
    try {
        await ProductionCompany.destroy({where: {id: req.params.id}})
        return res.status(200).json({})
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

///////////////////////////
// more specified routes //
///////////////////////////

module.exports = {
    getProductionCompanies,
    getProductionCompanyById,
    createProductionCompany,
    updateProductionCompany,
    deleteProductionCompany,
}