import React, { useEffect, useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Vibration } from 'react-native';
import { useForm } from 'react-hook-form'

import { AuthContext } from '../contextProviders/AuthContext';

function Login({ navigation }) {
  const { register, handleSubmit, setValue } = useForm()
  const [userType, setUserType] = useState('crew')
  const [errorResponse, setErrorResponse] = useState(null)

  // pull in context from AuthContext file
  const authContext = useContext(AuthContext)

  // pull out login function
  const { attemptLogin } = authContext

  // register values of form changes
  const onFieldChange = useCallback((name) => (text) => {
    setValue(name, text)
  }, [])

  // sends the login information to db
  const onSubmit = async (formData) => {
    try {
      const response = await attemptLogin(formData, userType);
      console.log('Within Login Screen: ', response)
      setErrorResponse(response)

      // Redirect to home
      navigation.navigate('Crew Portal')

      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Vibration.vibrate(3); // Vibrate for 5ms!!
      }
    } catch (error) {
      console.warn('Error occured on Submit: ', error);
    }

  }

  useEffect(() => {
    register('username');
    register('password')
  }, [register])

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        {/* Toggle for choosing user type */}
        <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Account Type: </Text>
                <TouchableOpacity
                    style={[styles.checkBox, userType === 'crew' ? styles.activeCheckBox : null]}
                    onPress={() => setUserType('crew')}
                >
                </TouchableOpacity>
            <Text>Crew</Text>
                <TouchableOpacity
                    style={[styles.checkBox, userType === 'productionCompany' ? styles.activeCheckBox : null]}
                    onPress={() => setUserType('productionCompany')}
                >
                </TouchableOpacity>
            <Text>Production Company</Text>
        </View>
        <TextInput
        style={styles.input}
        placeholder='Username'
        placeholderTextColor='#000'
        autoCapitalize="none"
        onChangeText={onFieldChange('username')}
        />
        <TextInput
        style={styles.input}
        placeholder='Password'
        placeholderTextColor='#000'
        autoCapitalize="none"
        onChangeText={onFieldChange('password')}
        // secureTextEntry={true} 
        />
        {errorResponse ? (
          <Text style={styles.errorMessage}>{errorResponse}</Text>
        ): (
          null
        )}
        <TouchableOpacity
            style={styles.button}
            underlayColor="#1E88E5" // Color when pressed
            onPress={handleSubmit(onSubmit)}
        >
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.container2}>
          <Text style={styles.title2}>New user?</Text>
          <TouchableOpacity
              style={styles.button}
              underlayColor="#1E88E5" // Color when pressed
              onPress={() => {
                handleSubmit(onSubmit)
                navigation.navigate('SignUp')
              }}
          >
              <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  title2: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    width: 250,
    borderRadius: 8, // Add rounded corners
  },
  checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  checkBox: {
      width: 15,
      height: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
      borderRadius: 20, 
  },
  activeCheckBox: {
      backgroundColor: '#2196F3',
  },
  button: {
    backgroundColor: '#2196F3', // Button background color
    padding: 12,
    borderRadius: 8, // Add rounded corners to match inputs
    width: 250,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorMessage:{
    color: 'red',
    fontSize: 12,
  },
});

export default Login;