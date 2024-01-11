const { DataTypes } = require('sequelize')
const db = require('../utils/db')

const User = require('./users')
const ProductionCompany = require('./productionCompanies')

const CalendarEvent = db.define("calendarEvents_table", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eventName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // productionId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    // },
    commentableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    commentableType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nativeCalId: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    tableName: "calendarEvents_table",
})

User.hasMany(CalendarEvent, {
    foreignKey: 'commentableId',
    constraints: false,
    scope: {
        commentableType: 'user'
    }
})

CalendarEvent.belongsTo(User, {
    foreignKey: 'commentableId',
    constraints: false,
    as: 'userEvent'
})

ProductionCompany.hasMany(CalendarEvent, {
    foreignKey: 'commentableId',
    constraints: false,
    scope: {
        commentableType: 'productionCompany'
    }
})

CalendarEvent.belongsTo(ProductionCompany, {
    foreignKey: 'commentableId',
    constraints: false,
    as: 'pcEvent'
})

CalendarEvent.addHook('afterFind', async (findResult) => {
    if (!Array.isArray(findResult)) findResult = [findResult];
    
    const promises = findResult.map(async (instance) => {
        if (instance.commentableType === 'user') {
            // Fetch User if commentableType is 'user' (From FrontEnd?)
            const user = await User.findByPk(instance.commentableId)
            instance.commentable = user
        } else if (instance.commentableType === 'productionCompany') {
            // Fetch ProductionCompany if commentableType is 'productionCompany'
            const productionCompany = await ProductionCompany.findByPk(instance.commentableId)
            instance.commentable = productionCompany
        }

        return instance
    })

    return Promise.all(promises)
});

module.exports = CalendarEvent