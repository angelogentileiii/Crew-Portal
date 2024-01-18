import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Card } from 'react-native-paper'

function CrewCard ({ crewMember, navigation }) {
    const {id, firstName, lastName, email, phoneNumber, unionMember, unionNumber} = crewMember

    const getStatusSubtitle = () => {
        const statusText = unionMember ? 'Active' : 'Inactive';
        const statusStyle = unionMember ? styles.activeSubtitle : styles.inactiveSubtitle;
    
        return (
            <Text style={{fontStyle: 'italic'}}>
                Union Status: <Text style={statusStyle}>{statusText}</Text>
            </Text>
        );
    };

    function formatPhoneNumber(phoneNumber) {
        // Format phone number as (XXX) XXX-XXXX
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    }

    const formattedPhoneNum = formatPhoneNumber(phoneNumber)

    return (
        <View key={id} style={styles.scrollContent}>
            <Card style={styles.cards}>
                <Card.Title 
                    title={`${firstName} ${lastName}`} 
                    titleStyle={styles.title} 
                    subtitle={getStatusSubtitle()} 
                />
                    <Card.Content>
                        <View style={styles.infoContainer}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Email:</Text>
                                <Text>{email}</Text>
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Telephone:</Text>
                                <Text>{formattedPhoneNum}</Text>
                            </View>
                        </View>
                        {unionMember ? (
                            <View style={styles.column}>
                                <Text style={styles.label}>Union Affiliation:</Text>
                                <Text>{unionNumber}</Text>
                            </View>
                        ) : null}
                    </Card.Content>
                    <Card.Actions>
                        <TouchableOpacity
                            style={styles.cardButton}
                            underlayColor="#1E88E5" // Color when pressed
                            onPress={() => {
                                navigation.push('Availability', {id: id})
                            }}
                        >
                            <Text style={styles.cardButtonText}>View Availability</Text>
                        </TouchableOpacity>
                    </Card.Actions>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContent: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        // backgroundColor: 'green',
    },
    cards: {
        marginVertical: '2.5%',
        width: '95%',
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },
    column: {
        width: '60%',
        paddingRight: 10,
        paddingBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 2,
        color: '#555',
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
    activeSubtitle: {
        color: 'green',
    },
    inactiveSubtitle: {
        color: 'red',
    },
})

export default CrewCard;
