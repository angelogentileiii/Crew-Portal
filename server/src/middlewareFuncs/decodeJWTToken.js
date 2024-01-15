const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken')


const decodeJwtToken = (req, res, next)=>{ 
    
    if (!req.header('Authorization')) {
        return res.status(401).json({ success: false, message: 'No Authorization Header' });
    }

    //Authorization: 'Bearer TOKEN'
    const token = req.header('Authorization').split(' ')[1];
    console.log('Within Decode After first If: ', token)

    // check if token exists
    if(!token) {
        res.status(401).json({success:false, message: "Error! Token was not provided."});
    }

    //Decoding the token that exists
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decodedToken) {
            // Check if the token is expired against current time
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp < currentTime) {
                return res.status(401).json({ success: false, message: 'Incorrect or Expired Token' });
            }

            const { username, email } = decodedToken;
            // console.log(username, email)
            req.user = { username, email }; // Attaching user information to req.user
            console.log('DECODE: ', decodedToken.exp)
        }
        next()
    }
    catch (error) {
        return res.status(401).json({message: "Incorrect token information."})
    }
}

module.exports = decodeJwtToken