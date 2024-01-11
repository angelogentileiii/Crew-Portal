import React, { useContext, useEffect, useState } from "react"
import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from "../contextProviders/AuthContext"

// SCREENS
import Login from './Login';
import JobBoard from './JobBoard';
import SignUp from './SignUp';
import CrewProfile from "./CrewProfile";
import ProductionDetails from "./ProductionDetails";
import Calendar from "./Calendar";

const Stack = createNativeStackNavigator()

function HomeScreen() {
    // const [isLoading, setIsLoading] = useState(true)
    // const [isLoggedIn, setIsLoggedIn] = useState(false)

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

    // useEffect(()=> {
    //     const fetchHome = async () => {
    //         await checkAccessToken();
    //         setIsLoading(false)
    //     };

    //     fetchHome();
    // }, []);

    // checkAccessToken()

    // stack navigator => intercept navigation control => check access token
    // receive 401 based on expiry
    // send user back to login


    // if (isLoading){
    //     return null
    // } else {
    //     if (isLoggedIn) {
    //         return (
    //                 <NavigationContainer>
    //                     <Stack.Navigator initialRouteName="CrewProfile">
    //                         <Stack.Screen name="JobBoard" component={JobBoard} />
    //                         <Stack.Screen name="CrewProfile" component={CrewProfile} />
    //                         <Stack.Screen name="ProductionDetails" component={ProductionDetails} />
    //                     </Stack.Navigator>
    //                 </NavigationContainer>
    //         )
    //     } else {
    //         return (
    //             <NavigationContainer>
    //                 <Stack.Navigator initialRouteName="Login">
    //                     <Stack.Screen
    //                         name="Calendar"
    //                         component={Calendar}
    //                     />
    //                     <Stack.Screen 
    //                         name="Login"
    //                         component={Login}
    //                     />
    //                     <Stack.Screen
    //                         name="SignUp"
    //                         component={SignUp}
    //                     />
    //                     <Stack.Screen
    //                         name="JobBoard"
    //                         component={JobBoard}
    //                     />
    //                     {/* <Stack.Screen name="ProductionDetails" component={ProductionDetails} /> */}
    //                 </Stack.Navigator>
    //             </NavigationContainer>
    //         );
    //     }
    // }

    // if (isLoggedIn) {
    //     return (
    //             <NavigationContainer>
    //                 <Stack.Navigator initialRouteName="CrewProfile">
    //                     <Stack.Screen name="JobBoard" component={JobBoard} />
    //                     <Stack.Screen name="CrewProfile" component={CrewProfile} />
    //                     <Stack.Screen name="ProductionDetails" component={ProductionDetails} />
    //                 </Stack.Navigator>
    //             </NavigationContainer>
    //     )
    // } else {
    //     return (
    //         <NavigationContainer>
    //             <Stack.Navigator initialRouteName="Login">
    //                 <Stack.Screen
    //                     name="Calendar"
    //                     component={Calendar}
    //                 />
    //                 <Stack.Screen 
    //                     name="Login"
    //                     component={Login}
    //                 />
    //                 <Stack.Screen
    //                     name="SignUp"
    //                     component={SignUp}
    //                 />
    //                 <Stack.Screen
    //                     name="JobBoard"
    //                     component={JobBoard}
    //                 />
    //                 {/* <Stack.Screen name="ProductionDetails" component={ProductionDetails} /> */}
    //             </Stack.Navigator>
    //         </NavigationContainer>
    //     );
    // }

    
    return (
        // <Stack.Navigator initialRouteName={isLoggedIn ? 'Calendar' : 'Login'}>
        <Stack.Navigator>
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="Calendar" component={Calendar} />
                    <Stack.Screen name="JobBoard" component={JobBoard} />
                    <Stack.Screen name="CrewProfile" component={CrewProfile} />
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