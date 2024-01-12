import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { AuthContext } from '../contextProviders/AuthContext';

import * as SecureStore from 'expo-secure-store'

import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function JobBoard({ navigation }){
    const[productions, setProductions] = useState([])

    const authContext = useContext(AuthContext)
    const { attemptLogout, checkAccessToken } = authContext

    // Using the custom fetch wrapper
    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    useEffect(() => {
        const fetchData = async () => {
            // let token = await SecureStore.getItemAsync('accessToken')
            // console.log('WITHIN JOBBOARD ATOKEN: ', token)

            try {
                await checkAccessToken()
                let token = await SecureStore.getItemAsync('accessToken')
                // const responseJSON = await fetchAuthWrapper('http://192.168.1.156:5555/productions', {
                const responseJSON = await fetchAuthWrapper('http://10.129.3.82:5555/productions', {
                    method: 'GET',
                });

                // console.log('AFTER PRODUCTIONS FETCH: ', responseJSON)
                setProductions(responseJSON);
            } catch (error) {
                console.error('Error occurred while fetching:', error);
            }
        };

        fetchData();
    }, []);

    const productionInfo = productions.map((production) => {
        const { name, type, location, unionProduction, id } = production

        return (
            <Card key={id} style={styles.cards}>
                <Card.Title title={name} subtitle={location} />
                    <Card.Content>
                        <Text>{type}</Text>
                        <Text>{unionProduction}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <TouchableOpacity
                            style={styles.cardButton}
                            underlayColor="#1E88E5" // Color when pressed
                            onPress={() => {
                                navigation.push('ProductionDetails', {id: id})
                            }}
                        >
                            <Text style={styles.cardButtonText}>View More</Text>
                        </TouchableOpacity>
                    </Card.Actions>
            </Card>
        )
    })

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {productionInfo}
            <TouchableOpacity
                style={styles.button}
                underlayColor="#1E88E5" // Color when pressed
                onPress={() => {
                    attemptLogout()
                    navigation.navigate('HomeScreen')
                }}
            >
                <Text style={styles.buttonText}>Logout?</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '5%',
    },
    cards: {
        width: '100%',
        margin: '2.5%',
        backgroundColor: '#fff'
    },
    cardButton: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#777',
        padding: 10,
        backgroundColor: 'fff',
    },
    cardButtonText: {
        color: '#777',
    },
    button: {
        backgroundColor: '#2196F3', // Button background color
        padding: 12,
        borderRadius: 8, // Add rounded corners to match inputs
        width: 250,
        marginBottom: '5%',
        marginTop: '2.5%',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});


export default JobBoard