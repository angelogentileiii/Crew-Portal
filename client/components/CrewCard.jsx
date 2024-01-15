import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Card } from 'react-native-paper'

function CrewCard ({ production }) {
    const {id, firstName, lastName, email, phoneNumber, unionMember, unionNumber} = production

    return (
        <View key={id} style={styles.scrollContent}>
            <Card style={styles.cards}>
                <Card.Title title={`${firstName} ${lastName}`} subtitle={`Union Status: ${unionMember ? 'Active' : 'InActive'}`} />
                    <Card.Content>
                        <Text>Email: {email}</Text>
                        <Text>Telephone: {phoneNumber}</Text>
                        {unionMember ? <Text>Union Affiliation: {unionNumber}</Text> : null}
                    </Card.Content>
                    <Card.Actions>
                        <TouchableOpacity
                            style={styles.cardButton}
                            underlayColor="#1E88E5" // Color when pressed
                            // onPress={() => {
                            //     navigation.push('ProductionDetails', {id: id})
                            // }}
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
        // backgroundColor: 'green',
    },
    cards: {
        margin: '2.5%',
        width: '95%',
        backgroundColor: '#fff',
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
})

export default CrewCard;
