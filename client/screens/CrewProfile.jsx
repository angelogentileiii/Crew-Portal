import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import { AuthContext } from '../contextProviders/AuthContext';
import useFetchAuthWrapper from '../components/fetchAuthWrapper';


function CrewProfile ({ navigation }) {
    const [userData, setUserData] = useState({})

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
                const responseJSON = await fetchAuthWrapper(URL + `/users/currentUser/`, {
                    method: 'GET',
                })

                setUserData(responseJSON)
            }
            catch (error) {
                console.error('Error occurred while Fetching Crew: ', error)
            }
        };

        fetchData()
    }, [])

    const addressParts = userData.address ? userData.address.split(', ') : [];
    const street = addressParts[0] || '';
    const cityStateZip = addressParts.slice(1).join(', ');

    function formatPhoneNumber(phoneNumber) {
        // Format phone number as (XXX) XXX-XXXX
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    }

    const formattedPhoneNum = formatPhoneNumber(userData.phoneNumber)

    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/defaultProfileJPG.jpg')} 
                style={styles.profileImage}
            />
            <Text style={styles.userName}>
                {userData.firstName} {userData.lastName}
            </Text>
            <View style={styles.profile}>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.userInfo}>
                        {street}
                    </Text>
                    <Text style={styles.userInfo}>
                        {cityStateZip}
                    </Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.userInfo}>
                        {userData.email}
                    </Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone:</Text>
                    <Text style={styles.userInfo}>
                        {formattedPhoneNum}
                    </Text>
                </View>
                {userData.unionMember ? (
                    <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Union Affiliation:</Text>
                    <Text style={styles.userInfo}>
                        {userData.unionNumber}
                    </Text>
                </View>
                ): (
                    null
                )}
            </View>
            <TouchableOpacity
                style={styles.button}
                underlayColor="#1E88E5"
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
        width: '55%',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userInfo: {
        fontSize: 16,
        marginBottom: 3,
    },
    button: {
        backgroundColor: '#2196F3', // Button background color
        padding: 12,
        borderRadius: 8, // Add rounded corners to match inputs
        width: 250,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default CrewProfile