import React, { useState, useContext, useEffect} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Card } from 'react-native-paper';
import { AuthContext } from '../contextProviders/AuthContext';

import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function JobBoard({ navigation }){
    const [productions, setProductions] = useState([]);
    const [filteredProductions, setFilteredProductions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    const authContext = useContext(AuthContext)
    const { attemptLogout, checkAccessToken, currentUserType } = authContext

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
        const filteredProdData = productions.filter((production) =>
            // const { name, type, location, unionProduction } = production

            production.name.toLowerCase().includes(searchText.toLowerCase()) ||
            production.type.toLowerCase().includes(searchText.toLowerCase()) ||
            production.location.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProductions(filteredProdData)
    }, [productions, searchText])

    useEffect(() => {
        const screenFocus = navigation.addListener('focus', () => {
            fetchData();
        });

        // Cleanup the listener when the component is unmounted
        return () => {
            screenFocus();
        };
    }, [navigation]);

    const productionInfo = filteredProductions.map((production) => {
        const { name, type, location, unionProduction, id } = production

        return (
            <Card key={id} style={styles.cards}>
                <Card.Title title={name} subtitle={location} />
                    <Card.Content>
                        <Text>{type}</Text>
                        <Text>{unionProduction}</Text>
                    </Card.Content>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>

                        {/* Quick Apply Button for Crew Only */}
                        {currentUserType === 'crew' ? (
                            <Card.Actions>
                                <TouchableOpacity
                                    style={styles.cardButton}
                                    underlayColor="#1E88E5" // Color when pressed
                                    onPress={() => {
                                        setModalVisible(true)
                                    }}
                                >
                                    <Text style={styles.cardButtonText}>Quick Apply</Text>
                                </TouchableOpacity>
                            </Card.Actions>
                        ): (
                            null
                        )}

                        {/* Details Button */}
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
                    </View>
            </Card>
        )
    })

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search Productions"
                placeholderTextColor='#000'
                value={searchText}
                onChangeText={setSearchText}
            />

            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.container}
            >
                {productionInfo}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                animationType='none'
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Application Sent!</Text>
                    </View>
                    <View style={styles.secondaryContent}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.secondaryButtonText}>Return</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
        // paddingVertical: 20,
        marginBottom: '.25%',
        // paddingBottom: 20,
        backgroundColor: '#fff',
        // backgroundColor: 'blue',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginVertical: '5%',
        width: 250,
        borderRadius: 8, // Add rounded corners
        backgroundColor: '#fff',
        // backgroundColor: 'yellow'
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '65%',
        height: '10%',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2, // Negative height to move shadow below the modal
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    secondaryContent: {
        width: '65%',
        backgroundColor: '#fff',
        borderRadius: 15,
        // padding: 20,
        marginTop: '2%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    secondaryButtonText: {
        color: "#2196F3",
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 20,
        padding: 7.5,
    },
});


export default JobBoard