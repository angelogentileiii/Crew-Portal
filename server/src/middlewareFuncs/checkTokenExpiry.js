// middleware function for checking token expiry
// use it for every route
const jwt = require('jsonwebtoken');

const checkJwtExpiration = (req, res, next) => {
    const token = req.headers['Authorization'].split(' ')[1];
    console.log('Within Decode: ', token)

    if (!token) {
        return res.status(401).send('No Token Provided!');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        // Check if the token is expired against current time
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            return res.status(401).send('Token has expired');
        }

        next();
    } catch (error) {
        // Handle other errors
        return res.status(400).send('Invalid Token');
    }
    // next();
};

module.exports = checkJwtExpiration;