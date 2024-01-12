import React, { useContext, useEffect, useState } from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from "../contextProviders/AuthContext"

// SCREENS
import Login from './Login';
import JobBoard from './JobBoard';
import SignUp from './SignUp';
import ProductionDetails from "./ProductionDetails";

// COMPONENTS
import NavigationBar from "../components/NavigationBar"

const Stack = createNativeStackNavigator()

function HomeScreen() {

    const authContext = useContext(AuthContext)
    const { checkAccessToken, isLoggedIn, setIsLoggedIn } = authContext

    console.log('Home: ', isLoggedIn)

    useEffect(()=> {
        const fetchHome = async () => {
            try {
                const validToken = await checkAccessToken();
                if (validToken) {
                    setIsLoggedIn(true)
                }
            } catch (error) {
                setIsLoggedIn(false); // Update state on token check failure
            } 
        };

        fetchHome();
    }, []);

    return (
        <Stack.Navigator>
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="Main" component={NavigationBar} options={{ headerShown: false }} />
                    <Stack.Screen name="ProductionDetails" component={ProductionDetails} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                    <Stack.Screen name="JobBoard" component={JobBoard} />
                </>
            )}
        </Stack.Navigator>
    )

}

export default HomeScreen;