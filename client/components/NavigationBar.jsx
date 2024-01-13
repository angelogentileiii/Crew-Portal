import React, {useContext} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import JobBoard from '../screens/JobBoard';

import CrewProfile from '../screens/CrewProfile';
import PCProfile from '../screens/PCProfile';
import AddProduction from '../screens/AddProduction';
import EventCalendar from '../screens/EventCalendar';
import { AuthContext } from "../contextProviders/AuthContext";

const Tab = createBottomTabNavigator();

function NavigationBar () {
    const authContext = useContext(AuthContext);
    const { isLoggedIn, currentUserType } = authContext;

    return (
        <Tab.Navigator initialRouteName="JobBoard" screenOptions={{ tabBarVisible: isLoggedIn }}>
            {(currentUserType === 'crew') ? (
                    <>
                        <Tab.Screen name="All Productions" component={JobBoard}  />
                        <Tab.Screen name="My Calendar" component={EventCalendar} />
                        <Tab.Screen name="Crew Profile" component={CrewProfile} />
                        {/* <Tab.Screen name="Add Production" component={AddProduction} /> */}
                    </>
                ):(
                    <>
                        <Tab.Screen name="All Productions" component={JobBoard}  />
                        <Tab.Screen name="My Calendar" component={Calendar} />
                        <Tab.Screen name="Company Profile" component={PCProfile} />
                        <Tab.Screen name="Add Production" component={AddProduction} />
                    </>
                )
            }
        </Tab.Navigator>
    )
}

export default NavigationBar