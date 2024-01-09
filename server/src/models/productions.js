const Sequelize = require('sequelize');
const db = require('../utils/db')
const ProductionCompany = require('./productionCompanies')

const Production = db.define('productions_table', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
            allowNull: false,
            primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    location: {
        type: Sequelize.STRING,
        allowNull: false
    },
    unionProduction: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    productionCompanyId: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
},
{
    tableName: 'productions_table'
})

Production.belongsTo(ProductionCompany)
ProductionCompany.hasMany(Production)

module.exports = Production