import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

// creates context to pass through app
export const AuthContext = createContext();

// creates the provider which holds the functions for context
export const AuthProvider = ({ children, navigation }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUserType, setCurrentUserType] = useState('crew')
    const [currentUser, setCurrentUser] = useState({})

    // home IP: 'http://192.168.1.156:5555/users'
    // flatiron IP: 'http://10.129.3.82:5555/users'

    ////////////////////////////////////////
    // signup post request
    const attemptSignup = async (userInfo, type) => {
        const endpoint = type === 'crew' ? '/auth/signupUser' : '/auth/signupPC';
        
        console.log('FETCH URL', `http://192.168.1.156:5555${endpoint}`)

        try {
            const response = await fetch(`http://192.168.1.156:5555${endpoint}`, {
            // const response = await fetch(`http://10.129.3.82:5555${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...userInfo,
                    userType: type,
                }),
            });
            const returnedData = await response.json();
            console.log('WITHIN SIGNUP ATTEMPT', returnedData)

            if (response.ok) {
                // console.log(returnedData?.data.accessToken)
                SecureStore.setItemAsync('accessToken', returnedData.data.accessToken.toString())
                SecureStore.setItemAsync('refreshToken', returnedData.data.refreshToken.toString())

                setIsLoggedIn(true)
                getCurrentUser(returnedData.data.userType)
                setCurrentUserType(returnedData.data.userType)

            } else {
                console.error('Auth Context - Registration error:', data.error);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    ///////////////////////////////////////////////////////////////////////////
    // home IP: 'http://192.168.1.156:5555/users/login'
    // flatiron IP: 'http://10.129.3.82:5555/users/login'

    // login function which returns my two tokens
    const attemptLogin = async (userInfo, type) => {
        const endpoint = await type === 'crew' ? '/auth/loginUser' : '/auth/loginPC';

        try {
            const response = await fetch( `http://192.168.1.156:5555${endpoint}`, {
            // const response = await fetch( `http://10.129.3.82:5555${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...userInfo, 
                    userType: type,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse error response
                console.error('Login error:', errorData);
            }
            
            const returnedData = await response.json();

            await SecureStore.setItemAsync('accessToken', returnedData.data.accessToken.toString())
            await SecureStore.setItemAsync('refreshToken', returnedData.data.refreshToken.toString())
            
            setIsLoggedIn(true)
            getCurrentUser(returnedData.data.userType)
            setCurrentUserType(returnedData.data.userType)

        } catch (error) {
            console.error('Login error:', error);
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
            console.log('WITHIN CHECK ACCESS: ', token)
            if (token) {
                try {
                    const response = await fetch(`http://192.168.1.156:5555/auth/decodeToken`, {
                    // const response = await fetch(`http://10.129.3.82:5555/auth/decodeToken`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + token,
                        }
                    })

                    console.log('Response status:', response.status);

                    if (response.ok) {
                        const responseJSON = await response.json()

                        // set logged in state and the current userType state
                        setIsLoggedIn(true)
                        setCurrentUserType(responseJSON.data.userType)

                        // checks token expiration
                        const expirationTime = new Date(responseJSON.exp * 1000);
                        const currentTime = new Date();

                        // checks remaining time till expiration
                        const timeRemaining = expirationTime - currentTime;

                        if (timeRemaining < 5 * 60 * 1000) {
                            // Token is about to expire, refresh it
                            const newAccessToken = await refreshTokens();
                            SecureStore.setItemAsync('accessToken', newAccessToken)
                        }

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


        try {
            const response = await fetch('http://192.168.1.156:5555/auth/refreshToken', {
            // const response = await fetch('http://10.129.3.82:5555/auth/refreshToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (response.ok) {
                const { accessToken } = await response.json();

                return accessToken; // Return the new access token
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            throw error;
        }
    };
    
    const getCurrentUser = async (type) => {
        const endpoint = await type === 'crew' ? '/users/currentUser' : '/productionCompanies/currentUser';
        const token = await SecureStore.getItemAsync('accessToken')

        try {
            const responseJSON = await fetch(`http://192.168.1.156:5555${endpoint}`, {
            // const responseJSON = await fetchAuthWrapper(`http://10.129.3.82:5555${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            })

            const currentUser = await responseJSON.json()


            setCurrentUser(currentUser)
        }
        catch (error) {
            console.error('Error occurred while Fetching: ', error)
        }
    }

    useEffect(() => {
        const checkTokenOnAppLoad = async () => {
            await checkAccessToken();
        };
    
        checkTokenOnAppLoad();
    }, []);

    const authContext = {
        attemptSignup,
        attemptLogin,
        attemptLogout,
        checkAccessToken,
        refreshTokens,
        setIsLoggedIn,
        getCurrentUser,
        currentUser,
        currentUserType,
        isLoggedIn,
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    )
};