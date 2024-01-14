import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventCalendar from '../screens/EventCalendar';

const Stack = createNativeStackNavigator();

export default function CalendarStack() {
    return (
        <Stack.Navigator 
        initialRouteName="EventCalendar" 
        mode="modal"
        >
            <Stack.Screen name="EventCalendar" component={EventCalendar} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
}