const ProductionCompany = require('../models/productionCompanies')

/////////////////////
// standard routes //
/////////////////////
const getProductionCompanies = async (req, res, next) => {
    try {
        const productionCompanies = await ProductionCompany.findAll({
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        });
        
        if (!productionCompanies) {
            res.status(404).json('No production companies found.')
        }
        const plainProductionCompanies = productionCompanies.get({ plain: true })
        return res.status(200).json(plainProductionCompanies)
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getProductionCompanyById = async (req, res, next) => {
    try{
        // findByPk means find by primary key (aka id)
        const productionCompany = await ProductionCompany.findByPk(req.params.id, {
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        })

        if (!productionCompany) {
            return res.status(404).json('No production company found.')
        }
        const plainProductionCompany = productionCompany.get({ plain: true })
        return res.status(200).json(plainProductionCompany)
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
                attributes: {exclude: ['createdAt', 'updatedAt', 'password']},
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

const getCurrentPC = async (req, res, next) => {
    try {
        // Access the user object from req.user set in the middleware
        const { username, email } = await req.user;
        const currentPC = await ProductionCompany.findOne({
            where: {
                username: username,
                email: email
            },
            attributes: {exclude: ['createdAt', 'updatedAt', 'password']}
        })

        const plainPC = currentPC.get({ plain: true });

        // console.log(currentUser)
        console.log(plainPC)

        return res.status(200).json(plainPC);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving current user.' });
    }
}

module.exports = {
    getProductionCompanies,
    getProductionCompanyById,
    updateProductionCompany,
    deleteProductionCompany,
    getCurrentPC
}