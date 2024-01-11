const { DataTypes } = require('sequelize');
const db = require('../utils/db');
const bcrypt = require('bcrypt');

const ProductionCompany = db.define('productionCompanies_table', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address:{
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true 
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    }
},
{
    tableName: 'productionCompanies_table'
})

// hash password before saving User instance
ProductionCompany.beforeSave(async (productionCompany) => {
    console.log('BEFORE SAVE PC PASSWORD')
    if (productionCompany.changed('password')) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(productionCompany.password, saltRounds);
        console.log('Hashed password during signup:', hashedPassword);
        productionCompany.password = hashedPassword
    }
})

// method to make sure passwords match during login
// ProductionCompany.prototype.checkPassword = async function (passwordAttempt) {
//     return await bcrypt.compare(passwordAttempt, this.password)
// }

module.exports = ProductionCompany