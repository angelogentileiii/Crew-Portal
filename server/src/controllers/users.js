require('dotenv').config()

const User = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


/////////////////////
// standard routes //
/////////////////////
const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users)
    }
    catch (error) {
        return res.status(404).json({error: error.message});
    }
}

const getUserById = async (req, res, next) => {
    try{
        // findByPk means find by primary key (aka id)
        const user = await User.findByPk(req.params.id)
        return res.status(200).json(user)
    }
    catch (error) {
        return res.status(404).json({error: error.message})
    }
}

const updateUser = async (req, res, next) => {
    try {
        // Find the keys that exist in my model
        // rawAttributes is built in to sequelize
        const modelAttributes = Object.keys(User.rawAttributes);

        // filter request keys to only match model keys
        const validKeys = Object.keys(req.body).filter((key) => {
            return modelAttributes.includes(key)
        })

        // New Object with only valid keys
        const userModel = validKeys.reduce((accum, key) => {
            // accumulates the keys and adds the pair to the userModel object
            // if does so based off the filtered validKeys from the req.body
            accum[key] = req.body[key]
            return accum
        }, {}) // empty object is the starting value to build the accumulator on
        
        try {

            // the User.update method returns an array with two element:
                // the number of rows affected by the update
                // an array of the instances updated or an empty array if no updates
                    // use the '_' for the number of rows because it is not needed
                    // since I know I will only update one user, set second element to updatedUser
            const [_, updatedUser] = await User.update(userModel, {
                where: {id: req.params.id},
                returning: true // returns updated user row
            })

            if (updatedUser) {
                return res.status(200).json(updatedUser)
            } else {
                return res.status(404).json({message: 'User not found.'})
            }
        }
        catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await User.destroy({where: {id: req.params.id}})
        return res.status(200).json({})
    }
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

// /////////////////////////
// // user login / signup //
// /////////////////////////

// const signupUser = async (req, res, next) => {
//     try {
//         // Find the keys that exist in my model
//         const modelAttributes = Object.keys(User.rawAttributes);

//         // filter request keys to only match model keys
//         const validKeys = Object.keys(req.body).filter((key) => {
//             return modelAttributes.includes(key)
//         })

//         // New Object with only valid keys
//         const newUser = validKeys.reduce((accum, key) => {
//             accum[key] = req.body[key]
//             return accum
//         }, {})

//         if (newUser.password) {
//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
//             newUser.password = hashedPassword
//         }

//         try {
//             const user = await User.create(newUser);

//             // avoid giving back the hashedpassword in the response
//             // const { password: _, ...userDataWithoutHash } = user.dataValues;
//             // return res.status(201).json(userDataWithoutHash)
//             try {
//                 const accessToken = jwt.sign(
//                     { 
//                         "username": user.username,
//                         "email": user.email,
//                     },
//                     process.env.ACCESS_TOKEN_SECRET,
//                     { expiresIn: '120s'}
//                 );
//                 const refreshToken = jwt.sign(
//                     { "username": user.username},
//                     process.env.REFRESH_TOKEN_SECRET,
//                     { expiresIn: '1d'}
//                 );
//                 return res.status(201).json({
//                     success: true,
//                     data: {
//                         username: user.username,
//                         email: user.email,
//                         accessToken: accessToken,
//                         refreshToken: refreshToken
//                     }
//                 })
//             }
//             catch (error) {
//                 return res.status(500).json({error: error.message})
//             }
//         }
//         catch (error) {
//             return res.status(500).json({error: error.message});
//         }
//     }
//     catch (error) {
//         return res.status(500).json({error: error.message});
//     }
// }

// const loginUser = async (req, res, next) => {
//     const { username, password } = req.body

//     // basic enter both items
//     if (!username || !password) {
//         return res.status(400).json({message: 'Username/Password are required.'})
//     }

//     // check to see if there is a user with the username entered
//     const foundUser = await User.findOne({
//         where: {username: username}
//     })

//     // if there is no user with that username
//     if (!foundUser) {
//         return res.status(401).json({message: 'Must enter a valid username.'})
//     }

//     // check if the password in request matches the password for the user?
//     const matchPassword = await bcrypt.compare(password, foundUser.password);

//     if (matchPassword) {
//         // don't pass the password!!
//         // create the access token (short expiry)
//         const accessToken = jwt.sign(
//             { 
//                 "username": foundUser.username,
//                 "email": foundUser.email,
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: '15m'}
//         );

//         // create the refresh token (later expiry)
//         const refreshToken = jwt.sign(
//             { 
//                 "username": foundUser.username,
//                 "email": foundUser.email
//             },
//             process.env.REFRESH_TOKEN_SECRET,
//             { expiresIn: '1d'}
//         );
        
        
//         return res.status(200).json({
//             success: true,
//             data: {
//                 username: foundUser.username,
//                 email: foundUser.email,
//                 accessToken: accessToken,
//                 refreshToken: refreshToken
//             }
//         })
        
//     } else {
//         return res.status(401).json({message: "Incorrect login information."})
//     }
// }

///////////////////////////
// more specified routes //
///////////////////////////

const getUserByUsername = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {username: req.params.username}
        });

        console.log('User found!', user)

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user)
    }
    catch (error) {
        console.error('Error fetching user: ', error)
        return res.status(500).json({error: error.message})
    }
}

const currentUser = async (req, res, next) => {
    try {
        // Access the user object from req.user set in the middleware
        const { username, email } = await req.user;
        const currentUser = await User.findOne({
            where: {
                username: username,
                email: email
            }
        })

        console.log(currentUser)

        return res.status(200).json(currentUser);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving current user.' });
    }
}

module.exports = {
    getUsers,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser,
    currentUser,
    // signupUser,
    // loginUser
}