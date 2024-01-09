const Sequelize = require('sequelize');
const db = require('../utils/db');
// const Production = require('./productions');

const ProductionCompany = db.define('productionCompanies_table', {
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
    address:{
        type: Sequelize.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true 
        }
    }
},
{
    tableName: 'productionCompanies_table'
})

// ProductionCompany.hasMany(Production)

module.exports = ProductionCompany