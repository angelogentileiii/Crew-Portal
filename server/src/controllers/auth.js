require('dotenv').config()

const User = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

        if (newUser.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
            newUser.password = hashedPassword
        }

        try {
            const user = await User.create(newUser);

            // avoid giving back the hashedpassword in the response
            // const { password: _, ...userDataWithoutHash } = user.dataValues;
            // return res.status(201).json(userDataWithoutHash)
            try {
                const accessToken = jwt.sign(
                    { 
                        "username": user.username,
                        "email": user.email,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '120s'}
                );
                const refreshToken = jwt.sign(
                    { "username": user.username},
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d'}
                );
                return res.status(201).json({
                    success: true,
                    data: {
                        username: user.username,
                        email: user.email,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                })
            }
            catch (error) {
                return res.status(500).json({error: error.message})
            }
        }
        catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const loginUser = async (req, res, next) => {
    const { username, password } = req.body

    // basic enter both items
    if (!username || !password) {
        return res.status(400).json({message: 'Username/Password are required.'})
    }

    // check to see if there is a user with the username entered
    const foundUser = await User.findOne({
        where: {username: username}
    })

    // if there is no user with that username
    if (!foundUser) {
        return res.status(401).json({message: 'Must enter a valid username.'})
    }

    // check if the password in request matches the password for the user?
    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (matchPassword) {
        // don't pass the password!!
        // create the access token (short expiry)
        const accessToken = jwt.sign(
            { 
                "username": foundUser.username,
                "email": foundUser.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        );

        // create the refresh token (later expiry)
        const refreshToken = jwt.sign(
            { 
                "username": foundUser.username,
                "email": foundUser.email
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );
        
        
        return res.status(200).json({
            success: true,
            data: {
                username: foundUser.username,
                email: foundUser.email,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        })
        
    } else {
        return res.status(401).json({message: "Incorrect login information."})
    }
}

// Endpoint for refreshing tokens
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
                email: decoded.email
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

module.exports = {
    signupUser,
    loginUser,
    refreshTokens,
}