// contain all fetch requests in app
// wrap these within a function to handle the 401 error
// provide via context to entire app to use when needed

// pull context from AuthContext
// setIsLoggedIn to false with 401 or something of that nature

import React, { useContext } from 'react';
import { AuthContext } from '../contextProviders/AuthContext';

const useFetchAuthWrapper = ({ navigation }) => {
    const authContext = useContext(AuthContext);
    const { setIsLoggedIn, refreshTokens } = authContext;

    const fetchAuthWrapper = async (url, options) => {
        try {
            const response = await fetch(url, options);

            if (response.status === 401) {
                try {
                    const refreshedToken = await refreshTokens(); // Call a function to refresh tokens
                    if (refreshedToken) {
                        // Retry the original request with the new access token
                        options.headers.Authorization = `Bearer ${refreshedToken}`;
                        const retryResponse = await fetch(url, options);
                        
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
                    console.error('Error at Beginning of 401', error)
                }
            }

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error Fetching 401 Auth:', error);
            throw error;
        }
    };

    return fetchAuthWrapper;
};

export default useFetchAuthWrapper;