// contain all fetch requests in app
// wrap these within a function to handle the 401 error
// provide via context to entire app to use when needed

// pull context from AuthContext
// setIsLoggedIn to false with 401 or something of that nature

import React, { useContext } from 'react';
import { AuthContext } from '../contextProviders/AuthContext';

import * as SecureStore from 'expo-secure-store'

const useFetchAuthWrapper = ({ navigation }) => {
    const authContext = useContext(AuthContext);
    const { setIsLoggedIn, refreshTokens, checkAccessToken } = authContext;

    const fetchAuthWrapper = async (url, options) => {
        try {
            // await checkAccessToken()
            let token = await SecureStore.getItemAsync('accessToken')
            // console.log('WITHIN AUTH WRAPPER: ', token)

            const response = await fetch(url, {
                ...options, 
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.status === 401) {
                try {
                    const refreshedToken = await refreshTokens(); // Call a function to refresh tokens
                    if (refreshedToken) {
                        // Retry the original request with the new access token
                        options.headers.Authorization = `Bearer ${refreshedToken}`;
                        const retryResponse = await fetch(url, options);
                        console.log('RETRIED RESPONSE')
                        
                        if (!retryResponse.ok) {
                            throw new Error(`HTTP Error! Status: ${retryResponse.status}`);
                        }

                        return retryResponse.json();
                    } else {
                        setIsLoggedIn(false);
                        navigation.navigate('Login');
                    }
                } catch (error) {
                    setIsLoggedIn(false);
                    navigation.navigate('Login');
                    console.error('Error at Beginning of 401 Check', error)
                }
            }

            if (!response.ok) {
                console.log(`HTTP Error! Status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.log('Error Fetching 401 Auth:', error);
        }
    };

    return fetchAuthWrapper;
};

export default useFetchAuthWrapper;