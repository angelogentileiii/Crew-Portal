import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import JobBoard from '../screens/JobBoard';
import CrewProfile from '../screens/CrewProfile';
import PCProfile from '../screens/PCProfile';
import CrewList from '../screens/CrewList';
import CalendarStack from './CalendarStack';

import { AuthContext } from '../contextProviders/AuthContext';

const Tab = createBottomTabNavigator();

function NavigationBar ({ navigation }) {
    const [isModalVisible, setModalVisible] = useState(false);

    const authContext = useContext(AuthContext);
    const { isLoggedIn, currentUserType, attemptLogout } = authContext;

    const logoutButton = () => {
        if (isLoggedIn) {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={attemptLogout}
                    >
                        <Text style={{ color: '#2196F3' }}>Logout</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    const addEventButton = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{ color: '#2196F3' }}>Add Event</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const addNewProductionButton = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => navigation.navigate('Add Production')}
                >
                    <Text style={{ color: '#2196F3' }}>Add Production</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <Tab.Navigator 
                initialRouteName="JobBoard" 
                screenOptions={{ 
                    tabBarVisible: isLoggedIn,
                    headerLeft: () => (
                    <View style={{ flexDirection: 'row' }}>
                        {logoutButton()}
                    </View>
                    )
                }}
            >
            {isLoggedIn && currentUserType === 'crew' ? (
                <>
                    <Tab.Screen 
                        name="All Productions" 
                        // options={{
                        //     headerRight: () => (
                        //         <View style={{flexDirection: 'row'}}>
                        //             <Text>TO BE FILTER</Text>
                        //         </View>
                        //     )
                        // }}
                        component= {JobBoard}
                    >
                    </Tab.Screen>
                    <Tab.Screen 
                        name="My Calendar" 
                        options={{
                            headerRight: () => (
                                <View style={{ flexDirection: 'row' }}>
                                    {addEventButton()}
                                </View>
                            )
                        }}
                    >
                        {() => <CalendarStack isModalVisible={isModalVisible} setModalVisible={setModalVisible} />}
                    </Tab.Screen>
                    <Tab.Screen 
                        name="My Profile" 
                        component={CrewProfile} 
                    />
                </>
            ) : (
                <>
                    <Tab.Screen 
                        name="Productions" 
                        options={{
                            headerRight: () => (
                                <View style={{ flexDirection: 'row' }}>
                                    {addNewProductionButton()}
                                </View>
                            )
                        }}
                        component={JobBoard} />
                    <Tab.Screen 
                        name="My Calendar"
                        options={{
                            headerRight: () => (
                                <View style={{ flexDirection: 'row' }}>
                                    {addEventButton()}
                                </View>
                            )
                        }} 
                        >
                            {() => <CalendarStack isModalVisible={isModalVisible} setModalVisible={setModalVisible} />}
                        </Tab.Screen>
                    <Tab.Screen name="Crew List" component={CrewList} />
                    <Tab.Screen name="Company Profile" component={PCProfile} />
                </>
            )}
            </Tab.Navigator>
        </>
    )
}

export default NavigationBar