const { DataTypes } = require('sequelize');
const db = require('../utils/db')

const ProductionCompany = require('./productionCompanies')

const Production = db.define('productions_table', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
            allowNull: false,
            primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unionProduction: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    productionCompanyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    tableName: 'productions_table'
})

Production.belongsTo(ProductionCompany)
ProductionCompany.hasMany(Production)

module.exports = Production