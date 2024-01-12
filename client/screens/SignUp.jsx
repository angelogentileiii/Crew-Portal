import React, { useState, useContext, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Platform, Vibration } from 'react-native';
import { useForm } from 'react-hook-form'
import { SelectList } from 'react-native-dropdown-select-list'

import { AuthContext } from '../contextProviders/AuthContext';

function SignUp ({ navigation }) {
    const [isUnionMember, setIsUnionMember] = useState(false);
    const [selectedUnionNumber, setSelectedUnionNumber] = useState([]);
    const [streetAddress, setStreetAddress] = useState('');
    const [cityState, setCityState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [userType, setUserType] = useState('crew')

    console.log(userType)

    const { register, setValue, handleSubmit } = useForm()

    const authContext = useContext(AuthContext)
    const { attemptSignup } = authContext

    // options for dropdown
    const unionNumbers = [
        { value: 'IATSE Local 1', key: '1' },
        { value: 'IATSE Local 52', key: '52' },
        { value: 'IATSE Local 600', key: '600' },
        { value: 'IATSE Local 728', key: '728' }
        // Add more union numbers as needed
    ];

    const onFieldChange = useCallback((name) => (text) => {
        if (name === 'streetAddress') {
            setStreetAddress(text)
        } else if (name === 'cityState') {
            setCityState(text)
        } else if (name === 'zipCode') {
            setZipCode(text)
        } else {
            setValue(name, text);
        }

        let address = `${streetAddress}, ${cityState} ${zipCode}`
        setValue('address', address);

    }, [setValue, streetAddress, cityState, zipCode, isUnionMember, selectedUnionNumber, userType])

    useEffect(() => {
        setValue('unionMember', isUnionMember);
        setValue('unionNumber', Number(selectedUnionNumber))
    }, [isUnionMember, selectedUnionNumber, setValue]);

    const fieldNamesCrew = [
        'firstName', 'lastName', 'address',
        'email', 'phoneNumber', 'unionMember',
        'unionNumber', 'username', 'password',
    ];

    const fieldNamesPC = [
        'companyName', 'address', 'email',
        'phoneNumber', 'username', 'password',
    ];

    useEffect(() => {
        const fields = userType === 'crew' ? fieldNamesCrew : fieldNamesPC;
        fields.forEach((field) => register(field))
    }, [register])

    const onSubmit = (formData) => {
        // console.log(formData)
        attemptSignup(formData, userType)

        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Vibration.vibrate(3); // Vibrate for 5ms!!
        }

        navigation.navigate('HomeScreen')
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
                <Text style={styles.title}>Create New Account</Text>
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

                {userType === 'crew' ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder='First Name'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('firstName')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Last Name'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('lastName')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Street Address'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('streetAddress')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='City/State'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('cityState')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Zip Code'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('zipCode')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Email Address'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('email')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Phone Number'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('phoneNumber')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('username')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('password')}
                    />
                    <View style={styles.checkboxContainer}>
                        <Text style={styles.checkboxLabel}>Union Member? </Text>
                        <TouchableOpacity
                            style={[styles.checkBox, isUnionMember ? styles.activeCheckBox : null]}
                            onPress={() => setIsUnionMember(!isUnionMember)}
                            >
                        </TouchableOpacity>
                    </View>
                    {isUnionMember ? 
                        <View style={styles.selectContainer}>
                            <SelectList
                                boxStyles={{borderColor: '#ccc', color:'#ccc'}}
                                dropdownStyles={{borderColor: '#ccc'}}
                                inputStyles={{borderColor: '#ccc'}}
                                label='Unions:'
                                placeholder='Select Union Number'
                                placeholderTextColor='#000'
                                setSelected={(val) => setSelectedUnionNumber(val)}
                                data={unionNumbers}
                                onSelect={() => {
                                    setSelectedUnionNumber(selectedUnionNumber)
                                    console.log('Within onSelect:', selectedUnionNumber)
                                }}
                                save='key'
                                badgeStyles={{backgroundColor: '#2196F3' }}
                                search={false}
                            />
                        </View> : null
                    }
                </>
                ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder='Company Name'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('companyName')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Street Address'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('streetAddress')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='City/State'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('cityState')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Zip Code'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('zipCode')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Email Address'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('email')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Phone Number'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('phoneNumber')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('username')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        placeholderTextColor='#000'
                        autoCapitalize='none'
                        onChangeText={onFieldChange('password')}
                    />
                </>)}
                <TouchableOpacity
                    style={styles.button}
                    underlayColor="#1E88E5" // Color when pressed
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    form: {
        width: '100%',
        flex: 1,
        padding: 10,
    },
    formContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 20,
        width: '100%',
        borderRadius: 8, // Add rounded corners
    },
    selectContainer: {
        flex: 1,
        width: '100%',
        paddingBottom: 12,
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
        marginBottom: 25,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default SignUp