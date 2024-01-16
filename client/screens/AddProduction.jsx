import React, { useEffect, useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableOpacity, Vibration, Platform } from 'react-native';
import { useForm } from 'react-hook-form'
import { SelectList } from 'react-native-dropdown-select-list'

import { AuthContext } from '../contextProviders/AuthContext';
import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function AddProduction ({ navigation }) {
    const { register, handleSubmit, setValue, getValues } = useForm();
    const [isUnionProd, setIsUnionProd] = useState(false);
    const [selectedProdType, setSelectedProdType] = useState(null);
    const [selectedProdFormat, setSelectedProdFormat] = useState(null);
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedState, setSelectedState] = useState('')
    const [location, setLocation] = useState('')

    const authContext = useContext(AuthContext)
    const { getCurrentUser, currentUser } = authContext

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    console.log('WITHIN ADD PRODUCTION: ', currentUser)

    const productionTypes = [
        { value: 'Commercial', key: 'Commercial' },
        { value: 'Documentary', key: 'Documentary' },
        { value: 'Film', key: 'Film' },
        { value: 'Reality', key: 'Reality'},
        { value: 'Short', key: 'Short' },
        { value: 'Social Media', key: 'Social Media' },
        { value: 'Television', key: 'Television' },
        // Add more union numbers as needed
    ];

    const productionFormats = {
            'Commercial': [
                { value: 'Campaign', key: 'Campaign' },
                { value: 'Spec/Proof of Concept', key: 'Spec/Proof of Concept' },
            ],
            'Documentary': [
                { value: 'Feature Length', key: 'Feature' },
                { value: 'Limited Series', key: 'Limited Series' },
            ],
            'Film': [
                { value: 'Feature', key: 'Feature' },
                { value: 'Short', key: 'Short' },
            ],
            'Reality': [
                { value: 'Episode', key: 'Episode' },
                { value: 'Series', key: 'Series' },
            ],
            'Short': [
                { value: 'Documentary', key: 'Documentary' },
                { value: 'Film', key: 'Film' },
            ],
            'Social Media': [
                { value: 'Campaign', key: 'Campaign' },
                { value: 'Promo', key: 'Promo' },
            ],
            'Television': [
                { value: 'Pilot', key: 'Pilot' },
                { value: 'Network Series', key: 'Series' },
                { value: 'Streaming Series', key: 'Streaming Series'}
            ]
        }

    const onFieldChange = useCallback((name) => async (text) => {
        if (name === 'city') {
            // setValue('location', `${text}, ${getValues('state') || ''}`);
            setSelectedCity(text)
            // setLocation(`${text}, ${selectedState || ''}`);
        } else if (name === 'state') {
            // setValue('location', `${getValues('city') || ''}, ${text}`);
            setSelectedState(text)
            // setLocation(`${selectedCity || ''}, ${text}`);
        } else {
            setValue(name, text)
        }

        let location = `${selectedCity}, ${selectedState}`
        setValue('location', location)

        console.log('WITHIN FIELD CHANGE', name, text)

    }, [setValue, selectedCity, selectedState])

    useEffect(() => {
        setValue('type', `${selectedProdFormat} ${selectedProdType}` );
        setValue('unionProduction', isUnionProd)
        setValue('location', `${selectedCity}, ${selectedState}`);
    }, [selectedProdFormat, selectedProdType, selectedCity, selectedState, setValue]);

    const addProduction = async ( formData ) => {
        try {

            console.log('FORM DATA BEFORE SUBMISSION:', formData);

            // const responseJSON = await fetchAuthWrapper('http://192.168.1.156:5555/productions', {
            const responseJSON = await fetchAuthWrapper('http://10.129.3.82:5555/productions', {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    'productionCompanyId': currentUser.id
                })
            })
            return await responseJSON
        }
        catch (error) {
            console.log('WITIHN ADD PRODUCTION:', error)
        }
    }

    const onSubmit = async (formData) => {
        
        try {
            delete formData.city;
            delete formData.state;

            console.log('WITHIN ON SUBMIT', formData)

            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                Vibration.vibrate(3); // Vibrate for 5ms!!
            }    
            
            await addProduction(formData)
            
            navigation.navigate('All Productions');
        }
        catch (error) {
            console.warn('Error occured on Submit: ', error)
        }
        
    }

    useEffect(() => {
        register('name');
        register('city');
        register('state');
    }, [register])

    return (
        <View style={styles.container}>
            <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
            {/* <Text style={styles.title}>Add Production Information</Text> */}
            <View style={styles.checkboxContainer}>
                <Text style={styles.checkboxLabel}>Production Contract: </Text>
                    <TouchableOpacity
                        style={[styles.checkBox, (isUnionProd === false) ? styles.activeCheckBox : null]}
                        onPress={() => setIsUnionProd(false)}
                    >
                    </TouchableOpacity>
                <Text>Non-Union</Text>
                    <TouchableOpacity
                        style={[styles.checkBox, (isUnionProd === true) ? styles.activeCheckBox : null]}
                        onPress={() => setIsUnionProd(true)}
                    >
                    </TouchableOpacity>
                <Text>Union</Text>
            </View>
            <View style={styles.selectContainer}>
                <SelectList
                    boxStyles={{borderColor: '#ccc' }}
                    dropdownStyles={{borderColor: '#ccc'}}
                    inputStyles={{borderColor: '#ccc'}}
                    label='Unions:'
                    placeholder='Select Production Type'
                    placeholderTextColor='#000'
                    setSelected={(val) => setSelectedProdType(val)}
                    data={productionTypes}
                    onSelect={() => {
                        setSelectedProdType(selectedProdType)
                        console.log('Within onSelect:', selectedProdType)
                    }}
                    save='key'
                    badgeStyles={{backgroundColor: '#2196F3' }}
                    search={false}
                />
            </View>
            { selectedProdType ? (
                <View style={styles.selectContainer}>
                    <SelectList
                        boxStyles={{ borderColor: '#ccc' }}
                        dropdownStyles={{ borderColor: '#ccc' }}
                        inputStyles={{ borderColor: '#ccc' }}
                        label="Production Formats:"
                        placeholder="Select Production Format"
                        placeholderTextColor="#000"
                        setSelected={(val) => setSelectedProdFormat(val)}
                        data={productionFormats[selectedProdType]}
                        save="key"
                        badgeStyles={{ backgroundColor: '#2196F3' }}
                        search={false}
                    />
                </View>
            ): null}
            <TextInput
                style={styles.input}
                placeholder='Working Title'
                placeholderTextColor='#000'
                autoCapitalize='none'
                onChangeText={onFieldChange('name')}
            />
            <TextInput
                style={styles.input}
                placeholder='City'
                placeholderTextColor='#000'
                autoCapitalize='none'
                onChangeText={onFieldChange('city')}
            />
            <TextInput
                style={styles.input}
                placeholder='State'
                placeholderTextColor='#000'
                autoCapitalize='none'
                onChangeText={onFieldChange('state')}
            />
            <TouchableOpacity
                style={styles.button}
                underlayColor="#1E88E5" // Color when pressed
                onPress={handleSubmit(onSubmit)}
            >
                <Text style={styles.buttonText}>Add To Job Board</Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        marginTop: 20,
    },
    form: {
        width: '100%',
        flex: 1,
        padding: 10,
        paddingTop: '40%',
    },
    formContent: {
        alignItems: 'center',
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

export default AddProduction