import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

// creates context to pass through app
export const AuthContext = createContext();

// creates the provider which holds the functions for context
export const AuthProvider = ({ children, navigation }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState({})

    // using just for logs on load (maybe keep to check if user stayed logged in??)
    // I can just pull from SecureStore throughout though
    // useEffect(() => {
    //     SecureStore.getItemAsync('accessToken')
    //         .then(data => {
    //             // setAccessToken(data)
    //             console.log('Stored AToken: ', data)
    //         })
    //         .catch((error) => console.error('Error storing token:', error));
    //     SecureStore.getItemAsync('refreshToken')
    //         .then(data => {
    //             // setRefreshToken(data)
    //             console.log('Stored RToken: ', data)
    //         })
    //         .catch((error) => console.error('Error storing token:', error));
    // }, [])

    // home IP: 'http://192.168.1.156:5555/users'
    // flatiron IP: 'http://10.129.3.82:5555/users'

    ////////////////////////////////////////
    // signup post request
    const attemptSignup = async (userInfo) => {
        try {
            const response = await fetch('http://192.168.1.156:5555/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo),
            });
            const returnedData = await response.json();
            if (response.ok) {
                console.log(returnedData.data.accessToken)
                SecureStore.setItemAsync('accessToken', returnedData.data.accessToken.toString())
                SecureStore.setItemAsync('refreshToken', returnedData.data.refreshToken.toString())
            } else {
                console.error('Registration error:', data.error);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    // home IP: 'http://192.168.1.156:5555/users/login'
    // flatiron IP: 'http://10.129.3.82:5555/users/login'

    // login function which returns my two tokens
    const attemptLogin = async (userInfo) => {
        try {
            const response = await fetch( 'http://192.168.1.156:5555/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo),
            });
            if (!response.ok) {
                const errorData = await response.json(); // Parse error response
                console.error('Login error:', errorData.error);
                throw new Error(errorData.error); // Throw an error for failed login
            }
            const returnedData = await response.json();

            await SecureStore.setItemAsync('accessToken', returnedData.data.accessToken.toString())
            await SecureStore.setItemAsync('refreshToken', returnedData.data.refreshToken.toString())
            
            console.log('Within Attempt Login:')
            setIsLoggedIn(true)
            console.log('After true Setter: ', isLoggedIn)

        } catch (error) {
            console.error('Login error:', error.message);
            throw new Error(error.message)
        }
    }

    ///////////////////////////////////////////////////////////////////////////

    // logout function
    const attemptLogout = async () => {
        try {
            // clear tokens
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('accessToken');

            setIsLoggedIn(false)

        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    ///////////////////////////////////////////////////////////////////////////

    // home IP: 'http://192.168.1.156:5555/accessToken'
    // flatiron IP: 'http://10.129.3.82:5555/acccessToken'

    // authorize token
    const checkAccessToken = async () => { 
        try {
            const token = await SecureStore.getItemAsync('accessToken')
            console.log('Within CheckAccess: ', token)
            if (token) {
                try {
                    const response = await fetch(`http://192.168.1.156:5555/accessToken`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + token,
                        }
                    })

                    console.log('Response status:', response.status);
                    console.log('Before conditional')
                    if (response.ok) {
                        const responseJSON = await response.json()

                        console.log('Within checkAccess Condition: ', responseJSON)
                        setIsLoggedIn(true)

                        // setCurrentUser(responseJSON)
                        console.log('Logged In Status:', isLoggedIn)

                        return responseJSON
                    }
                }
                catch (error) {
                    console.error("Error: ", error)
                }
            }
        }
        catch (error) {
        console.error("Error: ", error)
        }
    }

    ///
    const refreshTokens = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        if (!refreshToken) {
            return null; // No refresh token available
        }

        console.log("REFRESHING TOKENS CHECK!")

        try {
            const response = await fetch('http://192.168.1.156:5555/auth/refreshToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const { accessToken } = await response.json();
                // Optionally update the user context with the new access token
                // setUser({ ...user, accessToken }); // Update the user context
                return accessToken; // Return the new access token
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            throw error;
        }
    };


    /// fetch user info from token and set to state
    
    useEffect(() => {
        checkAccessToken();
    }, [])

    const authContext = {
        // accessToken,
        // refreshToken,
        attemptSignup,
        attemptLogin,
        attemptLogout,
        checkAccessToken,
        refreshTokens,
        isLoggedIn,
        setIsLoggedIn,
        // currentUser
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    )
};