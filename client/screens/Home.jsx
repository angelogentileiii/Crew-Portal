import React, { useContext, useEffect, useState } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext, AuthProvider } from "../contextProviders/AuthContext"

// SCREENS
import Login from './Login';
import JobBoard from './JobBoard';
import SignUp from './SignUp';
import CrewProfile from "./CrewProfile";
import ProductionDetails from "./ProductionDetails";
import Calendar from "./Calendar";

// COMPONENTS
import AvailabilitySelector from "../components/AvailabilitySelector"

const Stack = createNativeStackNavigator()

function Home() {
    // const [isLoading, setIsLoading] = useState(true)

    const authContext = useContext(AuthContext)
    const { checkAccessToken, isLoggedIn } = authContext

    console.log('Home: ', isLoggedIn)

    useEffect(()=> {
        const fetchHome = async () => {
            await checkAccessToken();
        };

        fetchHome();
    }, []);

    // stack navigator => intercept navigation control => check access token
    // receive 401 based on expiry
    // send user back to login

    if (isLoggedIn) {
        return (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="JobBoard">
                        <Stack.Screen name="JobBoard" component={JobBoard} />
                        <Stack.Screen name="CrewProfile" component={CrewProfile} />
                        <Stack.Screen name="ProductionDetails" component={ProductionDetails} />
                    </Stack.Navigator>
                </NavigationContainer>
        )
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Calendar"
                        component={Calendar}
                    />
                    <Stack.Screen 
                        name="Login"
                        component={Login}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                    />
                    <Stack.Screen
                        name="JobBoard"
                        component={JobBoard}
                    />
                    {/* <Stack.Screen name="ProductionDetails" component={ProductionDetails} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default Home;