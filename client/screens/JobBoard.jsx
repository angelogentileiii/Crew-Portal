import React, { useState, useContext, useEffect} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Card } from 'react-native-paper';
import { AuthContext } from '../contextProviders/AuthContext';

import useFetchAuthWrapper from '../components/fetchAuthWrapper';

function JobBoard({ navigation }){
    const [productions, setProductions] = useState([]);
    const [filteredProductions, setFilteredProductions] = useState([]);
    const [selectedProductionId, setSelectedProductionId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    const authContext = useContext(AuthContext)
    const { checkAccessToken, currentUserType, currentUser } = authContext

    // Using the custom fetch wrapper
    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    console.log('WITHIN JOBBOARD: ', currentUser)

    const fetchData = async () => {
        try {
            const response = await fetchAuthWrapper('http://192.168.1.156:5555/productions', {
            // const response = await fetchAuthWrapper('http://10.129.3.82:5555/productions', {
                method: 'GET',
            });

            console.log('WITHIN CREW FETCH JSON:', response);

            setProductions(response);
        } catch (error) {
            console.error('Error occurred while fetching productions:', error);
        }
    };

    const fetchPCProductions = async () => {

        // console.log('WITHIN PC FETCH: ', currentUser.username)
        const pcUsername = await currentUser.username

        try {
            const response = await fetchAuthWrapper(`http://192.168.1.156:5555/productions/byCompany/${pcUsername}`, {
            // const response = await fetchAuthWrapper(`http://10.129.3.82:5555/productions/byCompany/${pcUsername}`, {
                method: 'GET',
            })

            // console.log('WITHIN FETCH PC JSON:', response);
            if (!response.message) {
                setProductions(response);

            }
        }
        catch (error) {
            console.error('Error while fetching your productions', error)
        }
    };
    
    useEffect(() => {
        const screenFocus = navigation.addListener('focus', () => {

            // console.log('WITHIN USEFFECT ON JOB BOARD: ', currentUser)

            if (currentUserType === 'crew' && currentUser.username) {
                fetchData();
            } else if (currentUser.username) {
                fetchPCProductions();
            }
        });

        // Cleanup the listener when the component is unmounted
        return () => {
            screenFocus();
        };
    }, [navigation, currentUser.username, currentUserType]);


    useEffect(() => {
        if (currentUserType === 'crew' && currentUser.username) {
            fetchData();
        } else if (currentUser.username) {
            fetchPCProductions();
        }
    }, [currentUser, currentUserType])

    const removeProduction = async (id) => {
        try {
            await fetchAuthWrapper(`http://10.129.3.82:5555/productions/${id}`, {
                method: 'DELETE'
            })
            
            // If the deletion is successful, update the state with the new data
            const updatedProductions = productions.filter((production) => production.id !== id);

            console.log('DELETED!')
            setProductions(updatedProductions);
            // setFilteredProductions(updatedProductions)
        }
        catch (error) {
            console.error('Error occurred while deleting production:', error);
        }
    }

    console.log('SEARCH TEXT: ', searchText)

    useEffect(() => {
        // Filter productions based on search text
        const filteredProdData = productions.filter((production) =>
            production.name.toLowerCase().includes(searchText.toLowerCase()) ||
            production.type.toLowerCase().includes(searchText.toLowerCase()) ||
            production.location.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProductions(filteredProdData);
    }, [searchText, productions]);

    const productionInfo = filteredProductions?.map((production) => {
        const { name, type, location, unionProduction, id } = production

        const blurbDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

        return (
            <Card key={id} style={styles.cards}>
                <Card.Title 
                    title={name} 
                    titleStyle={{fontWeight: 'bold'}}
                    subtitle={location} 
                    subtitleStyle={{fontStyle: 'italic'}}
                />
                <Card.Content>
                    <Text style={styles.label}>Logline:</Text>
                    <Text>{blurbDescription}</Text>
                    
                    <View style={styles.infoContainer}>
                        <View style={styles.column}>
                            <Text style={styles.label}>Format:</Text>
                            <Text>{type}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>Crew Level:</Text>
                            <Text>{unionProduction ? 'Union' : 'Non-Union'}</Text>
                        </View>
                    </View>
                </Card.Content>

                <View style={styles.actionsContainer}>
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
                        <Card.Actions>
                            <TouchableOpacity
                                style={styles.cardButton}
                                underlayColor="#1E88E5" // Color when pressed
                                onPress={() => {
                                    setModalVisible(true)
                                    setSelectedProductionId(id)
                                }}
                            >
                                <Text style={styles.cardButtonText}>Remove Production</Text>
                            </TouchableOpacity>
                        </Card.Actions>
                    )}

                    {/* Details Button */}
                    <Card.Actions>
                        <TouchableOpacity
                            style={styles.cardButton}
                            underlayColor="#1E88E5" // Color when pressed
                            onPress={() => {
                                navigation.push('Production Details', {id: id})
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

            {currentUserType === 'crew' ? (
                <Modal
                    visible={isModalVisible}
                    animationType='none'
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={{fontSize: 16}}>Application Sent!</Text>
                        </View>
                        <View style={styles.secondaryContent}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.secondaryButtonText}>Return</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            ) : (
                <Modal
                    visible={isModalVisible}
                    animationType='none'
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Confirm deletion of Production</Text>
                        </View>
                        <View style={styles.secondaryContent}>
                            <TouchableOpacity onPress={() => {
                                removeProduction(selectedProductionId)
                                setModalVisible(false)
                            }}>
                                <Text style={{...styles.secondaryButtonText, color: 'red'}}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secondaryContent}>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                            }}>
                                <Text style={styles.secondaryButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        // backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
        // marginBottom: '.25%',
        backgroundColor: '#fff',
        // backgroundColor: 'blue',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: '5%',
        marginBottom: '5%',
        width: '95%',
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
        fontSize: 16,
        padding: 7.5,
    },
    column: {
        width: '60%',
        paddingRight: 10,
        paddingBottom: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#555',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    cardButton: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#777',
        padding: 10,
        marginLeft: 10,
        backgroundColor: '#fff',
    },
    cardButtonText: {
        color: '#777',
    },
});


export default JobBoard