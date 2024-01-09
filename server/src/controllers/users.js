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

///////////////////////////
// more specified routes //
///////////////////////////

const getUserByUsername = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username
            },
            attributes: {exclude: ['createdAt', 'updatedAt', 'id', 'password']}
        });

        console.log('User found!', user)

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const plainUser = currentUser.get({ plain: true });

        return res.status(200).json(plainUser)
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
            },
            attributes: {exclude: ['createdAt', 'updatedAt', 'id', 'password']}
        })

        const plainUser = currentUser.get({ plain: true });

        // console.log(currentUser)
        console.log(plainUser)

        return res.status(200).json(plainUser);
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
}