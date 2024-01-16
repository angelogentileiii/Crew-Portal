import React from 'react'
import { StyleSheet } from 'react-native'
import { AuthProvider } from './contextProviders/AuthContext'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator()

function App() {
  console.log('App executed')

  return (
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName='Crew Portal'
            >
            <Stack.Screen 
              name="Crew Portal"
              component={HomeScreen}
              options={{ headerShown: false }}
              />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    );
}

export default App;