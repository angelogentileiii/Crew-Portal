const express = require('express');
const dotenv = require('dotenv').config();

// import ORM
const sequelize = require('./src/utils/db.js');

// import all models for sequelize to sync off of (even though they are not called apparently)
const User = require('./src/models/users.js');
const Production = require('./src/models/productions.js');
const ProductionCompany = require('./src/models/productionCompanies.js');
const CalendarEvent = require('./src/models/calendarEvents.js')

// make the app/pull in env var
const app = express();
const PORT = process.env.PORT

//imported modules
const authRoutes = require('./src/routes/auth.js')
const userRoutes = require('./src/routes/users.js');
const productionRoutes = require('./src/routes/productions.js');
const productionCompanyRoutes = require('./src/routes/productionCompanies.js');
const calendarEventRoutes = require('./src/routes/calendarEvents.js')

// imported middleware
// const checkJwtExpiration = require('./src/middlewareFuncs/checkTokenExpiry.js')
const decodeJwtToken = require('./src/middlewareFuncs/decodeToken.js')

// allows us to access the json info from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    next()
})

app.use('/auth', authRoutes)

app.use('/users', decodeJwtToken, userRoutes )
app.use('/productions', decodeJwtToken, productionRoutes )
app.use('/productionCompanies', decodeJwtToken, productionCompanyRoutes)
app.use('/calendarEvents', decodeJwtToken, calendarEventRoutes)

// app.use('/accessToken', decodeJwtToken)

const serverRun = async () => {
    try {
        // sequelize creates the table inside the db before app runs
        await sequelize.sync(
            {force: false}
        )

        app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`)
        })
    }
    catch (error) {
        console.error('Error during server start:', error)
    }
}

serverRun()
