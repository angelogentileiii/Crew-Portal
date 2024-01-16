import React, { useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { AuthContext } from '../contextProviders/AuthContext';

import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function JobBoard({ navigation }){
    const[productions, setProductions] = useState([])

    const authContext = useContext(AuthContext)
    const { attemptLogout, checkAccessToken } = authContext

    // Using the custom fetch wrapper
    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    const fetchData = async () => {

        try {
            await checkAccessToken()
            // const responseJSON = await fetchAuthWrapper('http://192.168.1.156:5555/productions', {
            const responseJSON = await fetchAuthWrapper('http://10.129.3.82:5555/productions', {
                method: 'GET',
            });

            setProductions(responseJSON);
        } catch (error) {
            console.error('Error occurred while fetching productions:', error);
        }
    };

    useEffect(() => {
        const screenFocus = navigation.addListener('focus', () => {
            fetchData();
        });

        // Cleanup the listener when the component is unmounted
        return () => {
            screenFocus();
        };
    }, [navigation]);

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
                            <Text style={styles.cardButtonText}>View Details</Text>
                        </TouchableOpacity>
                    </Card.Actions>
            </Card>
        )
    })

    return (
        <ScrollView 
            style={{ backgroundColor: '#fff' }}
            contentContainerStyle={styles.container}
        >
            {productionInfo}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '5%',
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