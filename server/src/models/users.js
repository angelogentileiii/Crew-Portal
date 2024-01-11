const { DataTypes } = require('sequelize');
const db = require('../utils/db')
const bcrypt = require('bcrypt')

const User = db.define('users_table', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
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
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unionMember: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    unionNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, 
{
    tableName: 'users_table',
});

//hash password before saving User instance
User.beforeCreate(async (user) => {
    console.log('BEFORE SAVE USER PASSWORD')
    if (user.changed('password')) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword
    }
})

// method to make sure passwords match during login
User.prototype.checkPassword = async function (passwordAttempt) {
    return await bcrypt.compare(passwordAttempt, this.password)
}

module.exports = User