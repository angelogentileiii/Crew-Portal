import React, { useState, useContext, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Platform, Vibration } from 'react-native';
import { useForm } from 'react-hook-form'
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'

import { AuthContext } from '../contextProviders/AuthContext';

function SignUp ({ navigation }) {
    const [isUnionMember, setIsUnionMember] = useState(false);
    const [selectedUnionNumber, setSelectedUnionNumber] = useState([]); // for selecting your union number
    const [streetAddress, setStreetAddress] = useState('');
    const [cityState, setCityState] = useState('');
    const [zipCode, setZipCode] = useState('');

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

    }, [setValue, streetAddress, cityState, zipCode, isUnionMember, selectedUnionNumber])

    useEffect(() => {
        setValue('unionMember', isUnionMember);
        console.log('Within useEffect:', selectedUnionNumber)
        setValue('unionNumber', Number(selectedUnionNumber))
    }, [isUnionMember, selectedUnionNumber, setValue]);

    useEffect(() => {
        register('firstName')
        register('lastName')
        register('address')
        register('email')
        register('phoneNumber')
        register('unionMember') // dropdown later on
        register('unionNumber') // dropdown later on
        register('username')
        register('password')
    }, [register])

    const onSubmit = useCallback(formData => {
        console.log(formData)
        attemptSignup(formData)

        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Vibration.vibrate(35); // Vibrate for 35ms!!
        }
    }, [])

    // console.log('Outside everything:', selectedUnionNumber)

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Create New Account</Text> */}
            <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
                <Text style={styles.title}>Create New Account</Text>
                <TextInput
                    style={styles.input}
                    placeholder='First Name'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('firstName')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Last Name'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('lastName')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Street Address'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('streetAddress')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='City/State'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('cityState')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Zip Code'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('zipCode')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email Address'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('email')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Phone Number'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('phoneNumber')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    autoCapitalize='none'
                    onChangeText={onFieldChange('username')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
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
        margin: 10,
    },
    form: {
        width: '100%',
        flex: 1,
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