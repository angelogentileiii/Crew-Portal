


import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AvailabilitySelector from '../components/AvailabilitySelector';

import * as SecureStore from 'expo-secure-store'

import useCalendar from '../components/useCalendarHook';
import useFetchAuthWrapper from '../components/fetchAuthWrapper';
import { AuthContext } from '../contextProviders/AuthContext';

function Calendar({ navigation }) {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [dbEvents, setDBEvents] = useState([])

    // store events with id's fom native calendar
    const [localEvents, setLocalEvents] = useState([])

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    const authContext = useContext(AuthContext)
    const { attemptLogout, checkAccessToken } = authContext

    const {
        createCalendar,
        deleteCalendar,
        addEventsToCalendar,
        deleteEventsById,
        openSettings,
        getCalendarId,
        getPermission,
        getEvents,
    } = useCalendar('Crew Portal', '#5351e0', 'Crew Calendar');

    useEffect(() => {
        const fetchCalEvents = async () => {
            try {
                let token = await SecureStore.getItemAsync('accessToken')
                console.log('WITHIN USEEFFECT:', token)

                const responseJSON = await fetchAuthWrapper('http://10.129.3.82:5555/calendarEvents', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': "Bearer " + token
                    }
                })

                console.log('AFTER CAL EVENTS FETCH: ', responseJSON)
                setDBEvents(responseJSON)

                const events = await getEvents()
                console.log('GET EVENTS FUNCTION', events)
            } catch (error) {
                console.error('Error occurred while fetching:', error);
            }
        }

        fetchCalEvents()
    }, [])

    const handleStartConfirm = async (startDate) => {
        setSelectedStartDate(startDate);
        const permissionGranted = await getPermission();
        if (!permissionGranted) {
            openSettings();
        }
    };

    const handleEndConfirm = async (endDate) => {
        try {
            if (selectedStartDate) {
                setSelectedEndDate(endDate);
            } else {
                console.error('A start date is necessary for the event.')
            }
            const permissionGranted = await getPermission();
    
            if (!permissionGranted) {
                openSettings();
            }
        } 
        catch (error) {
            console.error('Error creating event:', error)
        }
    }

    const handleEventSubmit = async () => {
        const calendarId = await getCalendarId();
        if (!calendarId) {
            await createCalendar();
        }

        if (selectedStartDate && selectedEndDate) {
            try {
                let token = await SecureStore.getItemAsync('accessToken')
                console.log('TOKEN WITHIN SUBMIT:', token)

                // console.log('RESPONSE JSON POSTED CAL:', responseJSON.id)
                // Event added successfully
                const returnedId = await addEventsToCalendar(
                    'Unavailable To Work', 
                    selectedStartDate, 
                    selectedEndDate,
                    );
                
                     // Send the event data to your backend
                await fetchAuthWrapper('http://10.129.3.82:5555/calendarEvents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        startDate: selectedStartDate,
                        endDate: selectedEndDate,
                        eventName:'Unavailable to Work',
                        nativeCalId: returnedId
                    }),
                });

            } catch (error) {
                console.error('Error adding event:', error)
            }
        } else {
            openSettings();
        }
    };

    const handleDeleteEvent = (id) => {
        deleteEventsById(id, 'Crew Calendar')
        const updatedEvents = dbEvents.filter((event) => event.nativeCalId !== id)
        setDBEvents(updatedEvents)
    }

    const removeCalendar = () => {
        setDBEvents([])
        deleteCalendar();
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <AvailabilitySelector
                    onStartDateSelected={handleStartConfirm}
                    onEndDateSelected={handleEndConfirm}
                />
                <TouchableOpacity
                    style={styles.button}
                    underlayColor="#1E88E5" // Color when pressed
                    onPress={() => {
                        handleEventSubmit()
                        // navigate.navigate('Login')
                    }}
                >
                    <Text style={styles.buttonText}>Add Event</Text>
                </TouchableOpacity>
                {/* {events.map((event) => {
                    event.map((e) => {
                        console.log('within Double Map Business:', e['startDate'])
                    })
                })} */}
                <TouchableOpacity
                    style={styles.button}
                    underlayColor="#1E88E5" // Color when pressed
                    onPress={() => {
                        removeCalendar()
                        // navigate.navigate('Login')
                    }}
                >
                    <Text style={styles.buttonText}>Remove Calendar</Text>
                </TouchableOpacity>
                {dbEvents ? dbEvents.map((event, index) => {
                    return (
                        <View key={index}>
                            <Text>Calendar Event #{index + 1}</Text>
                            <Text>ID: {event.id}</Text>
                            <Text>Start: {event.startDate}</Text>
                            <Text>End: {event.endDate}</Text>
                            <TouchableOpacity
                                style={styles.smallButton}
                                underlayColor="#1E88E5" // Color when pressed
                                onPress={() => {
                                    handleDeleteEvent(event.nativeCalId)
                                }}
                            >
                                <Text style={styles.buttonText}>x</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }): (null)}
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
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    smallButton: {
        backgroundColor: '#2196F3', // Button background color
        padding: 3,
        borderRadius: 8,
        width: 20,
    }
});

export default Calendar;