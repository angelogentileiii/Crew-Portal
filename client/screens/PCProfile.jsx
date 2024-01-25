import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { AuthContext } from '../contextProviders/AuthContext';
import useFetchAuthWrapper from '../components/fetchAuthWrapper';


function CrewProfile ({ navigation }) {
    const [pcData, setPCData] = useState({})

    const authContext = useContext(AuthContext)
    const { attemptLogout, checkAccessToken } = authContext

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    const URL = 'http://192.168.1.156:5555'
    // const URL = 'http://10.129.3.82:5555'


    useEffect(() => {
        const fetchData = async () => {
            let user = await checkAccessToken()
            console.log('Check Access:', user)

            try {
                const responseJSON = await fetchAuthWrapper(URL + `/productionCompanies/currentUser`, {
                    method: 'GET',
                })

                setPCData(responseJSON)
            }
            catch (error) {
                console.error('Error occurred while Fetching PC: ', error)
            }
        };

        fetchData()
    }, [])

    function formatPhoneNumber(phoneNumber) {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    }

    const formattedPhoneNumber = formatPhoneNumber(pcData.phoneNumber);

    return (
        <View style={styles.container}>
            <Text style={styles.userName}>{pcData.companyName}</Text>
            <View style={styles.profile}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Address:</Text>
                    <View style={styles.infoItem}>
                        <FontAwesome name="map-marker" size={20} color="#333" />
                        <Text style={styles.userInfo}>{pcData.address}</Text>
                    </View>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <View style={styles.infoItem}>
                        <FontAwesome name="envelope" size={20} color="#333" />
                        <Text style={styles.userInfo}>{pcData.email}</Text>
                    </View>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone:</Text>
                    <View style={styles.infoItem}>
                        <FontAwesome name="phone" size={20} color="#333" />
                        <Text style={styles.userInfo}>{formattedPhoneNumber}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.button}
                underlayColor="#1E88E5" // Color when pressed
                onPress={() => {
                    attemptLogout()
                    navigation.navigate('Crew Portal')
                }}
            >
                <Text style={styles.buttonText}>Logout?</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profile: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    fieldContainer: {
        marginVertical: 5,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userInfo: {
        fontSize: 16,
        marginLeft: 8
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
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
});

export default CrewProfile