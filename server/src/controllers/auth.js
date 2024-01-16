require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/users');
const ProductionCompany = require('../models/productionCompanies');

/////////////////////////
// user login / signup //
/////////////////////////

const signupUser = async (req, res, next) => {
    try {
        // Find the keys that exist in my model
        const modelAttributes = Object.keys(User.rawAttributes);

        // filter request keys to only match model keys
        const validKeys = Object.keys(req.body).filter((key) => {
            return modelAttributes.includes(key)
        })

        // New Object with only valid keys
        const newUser = validKeys.reduce((accum, key) => {
            accum[key] = req.body[key]
            return accum
        }, {})

        try {
            const user = await User.create(newUser);

            try {
                const accessToken = jwt.sign(
                    { 
                        "username": user.username,
                        "email": user.email,
                        "userType": userType
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '120s'}
                );
                const refreshToken = jwt.sign(
                    { 
                        "username": user.username,
                        "email": user.email,
                        "userType": userType
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d'}
                );
                return res.status(201).json({
                    success: true,
                    data: {
                        username: user.username,
                        email: user.email,
                        userType: userType,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                })
            }
            catch (error) {
                return res.status(500).json({'Error building Tokens': error.message})
            }
        }
        catch (error) {
            return res.status(500).json({'Error creating new User': error.message});
        }
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const loginUser = async (req, res, next) => {
    const { username, password, userType } = req.body

    // basic enter both items
    if (!username) {
        return res.status(400).json({message: 'Username is required'})
    }

    if (!password) {
        return res.status(400).json({message: 'Password is required'})
    }

    // check to see if there is a user with the username entered
    const foundUser = await User.findOne({
        where: {username: username}
    })

    // if there is no user with that username
    if (!foundUser) {
        return res.status(401).json({message: 'Must enter valid account information'})
    }

    // check if the password in request matches the password for the user?
    const matchPassword = await bcrypt.compare(password, foundUser.password);

    console.log('MATCHED PASSWORD:', matchPassword)

    if (matchPassword) {
        // don't pass the password!!
        // create the access token (short expiry)
        const accessToken = jwt.sign(
            { 
                "username": foundUser.username,
                "email": foundUser.email,
                "userType": userType
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        );

        console.log('ACCESS TOKEN LOGIN:', accessToken)

        // create the refresh token (later expiry)
        const refreshToken = jwt.sign(
            { 
                "username": foundUser.username,
                "email": foundUser.email,
                "userType": userType
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        
        console.log('REFRESH TOKEN LOGIN:', refreshToken)
        
        res.status(200).json({
            success: true,
            data: {
                username: foundUser.username,
                email: foundUser.email,
                userType: userType,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })
        
    } else {
        return res.status(401).json({message: "Please re-enter password"})
    }
}

//////////////////////////////////////
// productionCompany login / signup //
//////////////////////////////////////

const signupPC = async (req, res, next) => {
    try {
        const modelAttributes = Object.keys(ProductionCompany.rawAttributes);

        const validKeys = Object.keys(req.body).filter((key) => {
            return modelAttributes.includes(key)
        })

        const newPC = validKeys.reduce((accum, key) => {
            accum[key] = req.body[key]
            return accum
        }, {})

        console.log('WITHIN SIGNUP ', newPC)

        try {
            const pc = await ProductionCompany.create(newPC);

            try {
                const accessToken = jwt.sign(
                    { 
                        "username": pc.username,
                        "email": pc.email,
                        "userType": userType,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '120s'}
                );

                const refreshToken = jwt.sign(
                    { 
                        "username": pc.username,
                        "email": pc.email,
                        "userType": userType
                    },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d'}
                );
                
                return res.status(201).json({
                    success: true,
                    data: {
                        username: pc.username,
                        email: pc.email,
                        userType: userType,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                })
            }
            catch (error) {
                return res.status(500).json({'Error building tokens': error.message})
            }
        }
        catch (error) {
            return res.status(500).json({'Error creating new Production Company': error.message});
        }
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const loginPC = async (req, res, next) => {
    console.log('WITHIN LOGINPC', req.body)
    const { username, password, userType } = req.body

    // basic enter both items
    if (!username) {
        return res.status(400).json({message: 'Username is required'})
    }

    if (!password) {
        return res.status(400).json({message: 'Password is required'})
    }

    // check to see if there is a user with the username entered
    const foundPC = await ProductionCompany.findOne({
        where: {username: username}
    })

    // console.log('FOUNDPC: ', foundPC)
    // console.log('REQ BODY PWORD: ', password)

    if (!foundPC) {
        return res.status(401).json({message: 'Please enter a valid username'})
    }

    // console.log('FOUNDPC PWORD: ', foundPC);
    // check if the password in request matches the password for the user?
    const matchPassword = await bcrypt.compareSync(password, foundPC.password);
    // const matchPassword = await bcrypt.compare('t123', foundPC.password);

    // console.log('MATCH PWORD: ', matchPassword);

    if (matchPassword) {
        // don't pass the password!!
        // create the access token (short expiry)
        const accessToken = jwt.sign(
            { 
                "username": foundPC.username,
                "email": foundPC.email,
                "userType": userType
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        );

        // create the refresh token (later expiry)
        const refreshToken = jwt.sign(
            { 
                "username": foundPC.username,
                "email": foundPC.email,
                "userType": userType
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        
        
        return res.status(200).json({
            success: true,
            data: {
                username: foundPC.username,
                email: foundPC.email,
                userType: userType,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })
        
    } else {
        return res.status(401).json({message: "Please re-enter password"})
    }
}

////////////////////
// Refresh Tokens //
////////////////////
const refreshTokens = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Create a new access token
        const accessToken = jwt.sign(
            {
                username: decoded.username,
                email: decoded.email,
                userType: decoded.userType,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } // Set your desired expiry time for the new access token
        );

        // Respond with the new access token
        return res.status(200).json({ success: true, accessToken });
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }
};

// decode token (not as middleware) //

const decodeToken = (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];

        console.log('WITHIN DECODE TOKEN:', token)
        if (!token) {
            return res.status(401).json({ success: false, message: 'Error! Token was not provided.' });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("WITHIN DECODE:", decodedToken)

        return res.status(200).json(
            { 
                success: true, 
                data: decodedToken,
                exp: decodedToken.exp
            }
        );
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid Token' });
    }
};

module.exports = {
    signupUser,
    loginUser,
    signupPC,
    loginPC,
    refreshTokens,
    decodeToken
}