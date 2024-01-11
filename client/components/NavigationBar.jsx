import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import JobBoard from '../screens/JobBoard';
import Calendar from '../screens/Calendar';
import CrewProfile from '../screens/CrewProfile';
import PCProfile from '../screens/PCProfile';

import { AuthContext } from "../contextProviders/AuthContext";

const Tab = createBottomTabNavigator();

function NavigationBar () {
    const authContext = useContext(AuthContext);
    const { isLoggedIn, currentUserType } = authContext;

    return (
        <Tab.Navigator initialRouteName="JobBoard" screenOptions={{ tabBarVisible: isLoggedIn }}>
            {(currentUserType === 'crew') ? (
                    <>
                        <Tab.Screen name="JobBoard" component={JobBoard}  />
                        <Tab.Screen name="Calendar" component={Calendar} />
                        <Tab.Screen name="CrewProfile" component={CrewProfile} />
                    </>
                ):(
                    <>
                        <Tab.Screen name="JobBoard" component={JobBoard}  />
                        <Tab.Screen name="Calendar" component={Calendar} />
                        <Tab.Screen name="Profile" component={PCProfile} />
                    </>
                )
            }
        </Tab.Navigator>
    )
}

export default NavigationBar