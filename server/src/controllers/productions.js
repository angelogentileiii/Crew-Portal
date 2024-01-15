const Production = require('../models/productions')
const ProductionCompany = require('../models/productionCompanies')

/////////////////////
// standard routes //
/////////////////////
const getProductions = async (req, res, next) => {
    try {
        const productions = await Production.findAll();
        return res.status(200).json(productions)
    }
    catch (error) {
        return res.status(404).json({error: error.message});
    }
}

const getProductionById = async (req, res, next) => {
    try{
        // findByPk means find by primary key (aka id)
        const production = await Production.findByPk(req.params.id)
        return res.status(200).json(production)
    }
    catch (error) {
        return res.status(404).json({error: error.message})
    }
}

const createProduction = async (req, res, next) => {
    try {
        const modelAttributes = Object.keys(Production.rawAttributes);

        const validKeys = Object.keys(req.body).filter((key) => {
            return modelAttributes.includes(key)
        })

        const newProduction = validKeys.reduce((accum, key) => {
            accum[key] = req.body[key]
            return accum
        }, {})

        try {
            const production = await Production.create(newProduction);
            return res.status(201).json(production)
        }
        catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const updateProduction = async (req, res, next) => {
    try {
        const modelAttributes = Object.keys(User.rawAttributes);

        const validKeys = Object.keys(req.body).filter((key) => {
            return modelAttributes.includes(key)
        })

        const productionModel = validKeys.reduce((accum, key) => {
            accum[key] = req.body[key]
            return accum
        }, {})

        try {
            const [_, updatedProduction] = await Production.update(productionModel, {
                where: {id: req.params.id},
                returning: true
            })

            if (updatedProduction) {
                return res.status(200).json(updatedProduction)
            } else {
                return res.status(404).json({message: "Production not found."})
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

const deleteProduction = async (req, res, next) => {
    try {
        await Production.destroy({where: {id: req.params.id}})
        return res.status(200).json({})
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

///////////////////////////
// more specified routes //
///////////////////////////
const getProductionByPC = async (req, res, next) => {
    try {
        const productionCompany = await ProductionCompany.findOne({
            where: {name: req.params.pcName},
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });

        console.log(productionCompany.dataValues)

        if (!productionCompany) {
            return res.status(404).json({message: "Production company not found"})
        }
        const productions = await Production.findAll({
            where: {productionCompanyId: productionCompany.id},
        })

        const productionData = productions.map(production => production.get({ plain: true }));

        console.log(productionData)

        return res.status(200).json(productionData)
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

module.exports = {
    getProductions,
    getProductionById,
    createProduction,
    updateProduction,
    deleteProduction,
    getProductionByPC
}