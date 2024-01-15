import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventCalendar from '../screens/EventCalendar';

const Stack = createNativeStackNavigator();

export default function CalendarStack({ isModalVisible, setModalVisible}) {
    return (
        <Stack.Navigator 
        initialRouteName="Event Calendar" 
        mode="modal"
        >
            <Stack.Screen 
                name="Event Calendar" 
                options={{ headerShown: false }}
            >
                {() => <EventCalendar isModalVisible={isModalVisible} setModalVisible={setModalVisible} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}