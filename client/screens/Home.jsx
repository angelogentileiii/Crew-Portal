import React, { useContext, useEffect, useState } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext, AuthProvider } from "../contextProviders/AuthContext"
    
import Login from './Login';
import JobBoard from './JobBoard';
import SignUp from './SignUp';
import CrewProfile from "./CrewProfile";
import ProductionDetails from "./ProductionDetails";

const Stack = createNativeStackNavigator()

function Home() {
    const authContext = useContext(AuthContext)
    const { checkAccessToken, isLoggedIn } = authContext

    console.log('Home: ', isLoggedIn)

    useEffect(()=> {
        checkAccessToken()
    }, [])

    // checkAccessToken()

    // stack navigator => intercept navigation control => check access token
    // receive 401 based on expiry
    // send user back to login

    if (isLoggedIn) {
        return (
            // <AuthProvider>
                <NavigationContainer>
                <Stack.Navigator initialRouteName="JobBoard">
                    <Stack.Screen name="CrewProfile" component={CrewProfile} />
                    <Stack.Screen name="JobBoard" component={JobBoard} />
                    <Stack.Screen name="ProductionDetails" component={ProductionDetails} />
                </Stack.Navigator>
                </NavigationContainer>
            // </AuthProvider>
        )
    } else {
        return (
            // <AuthProvider>
                <NavigationContainer>
                    <Stack.Navigator>
                    <Stack.Screen 
                        name="Login"
                        component={Login}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                    />
                    {/* <Stack.Screen
                        name="JobBoard"
                        component={JobBoard}
                    /> */}
                    {/* <Stack.Screen name="ProductionDetails" component={ProductionDetails} /> */}
                    </Stack.Navigator>
                </NavigationContainer>
            // </AuthProvider>
        );
    }
}

export default Home;