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
import AddProduction from "./AddProduction";

const Stack = createNativeStackNavigator()

function HomeScreen() {

    const authContext = useContext(AuthContext)
    const { checkAccessToken, isLoggedIn, setIsLoggedIn } = authContext

    console.log('Home: ', isLoggedIn)

    useEffect(()=> {
        const fetchHome = async () => {
            try {
                await checkAccessToken();
            } catch (error) {
                setIsLoggedIn(false);
            } 
        };

        fetchHome();
    }, []);

    return (
        <Stack.Navigator>
            {isLoggedIn ? (
                <>
                    <Stack.Screen 
                        name="Main" 
                        component={NavigationBar} 
                        options={{ 
                            headerShown: false 
                        }} 
                        />
                    <Stack.Screen 
                        name="ProductionDetails" 
                        component={ProductionDetails} 
                        options={{ 
                            headerShown: true 
                        }} 
                        />
                    <Stack.Screen
                        name="Add Production"
                        component={AddProduction}
                        options={{
                            headerShown: true
                        }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen 
                        name="Login" 
                        component={Login}
                        options={{ 
                            headerShown: false 
                        }} 
                    />
                    <Stack.Screen 
                        name="SignUp" 
                        component={SignUp} 
                        options={{ 
                            headerShown: true 
                        }} 
                    />
                    <Stack.Screen 
                        name="JobBoard" 
                        component={JobBoard}
                        options={{ 
                            headerShown: false 
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    )
}

export default HomeScreen;