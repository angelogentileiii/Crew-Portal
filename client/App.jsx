import React from 'react'
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
          <Stack.Navigator initialRouteName='HomeScreen' headerMode="none">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    );
}

export default App;