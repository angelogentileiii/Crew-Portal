


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
    const [isStartPickerVisible, setStartPickerVisible] = useState(false);
    const [isEndPickerVisible, setEndPickerVisible] = useState(false);
    const [dbEvents, setDBEvents] = useState([])

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    const authContext = useContext(AuthContext)
    const { attemptLogout, currentUserType } = authContext

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

    const fetchCalEvents = async () => {
        const endpoint = await currentUserType === 'crew' ? '/user/current' : '/pc/current';

        try {
            let token = await SecureStore.getItemAsync('accessToken')
            // console.log('WITHIN USEEFFECT:', token)

            const responseJSON = await fetchAuthWrapper(`http://10.129.3.82:5555/calendarEvents${endpoint}`, {
                method: 'GET',
                // headers: {
                //     'Accept': 'application/json',
                //     'Authorization': "Bearer " + token
                // }
            })

            if (responseJSON) {
                // console.log('AFTER CAL EVENTS FETCH: ', responseJSON)
                setDBEvents(responseJSON)

                const events = await getEvents()
                // console.log('GET EVENTS FUNCTION', events)
            } else {
                setDBEvents([])
            }
            
        } catch (error) {
            console.error('Error occurred while fetching:', error);
        }
    }

    useEffect(()=> {
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
                // console.log('TOKEN WITHIN SUBMIT:', token)

                // Event added successfully
                const returnedId = await addEventsToCalendar(
                    'Unavailable To Work', 
                    selectedStartDate, 
                    selectedEndDate,
                    );
                
                if (returnedId) {
                    try {
                        // Send the event data to your backend
                        await fetchAuthWrapper('http://10.129.3.82:5555/calendarEvents/', {
                            method: 'POST',
                            // headers: {
                            //     'Content-Type': 'application/json',
                            //     'Authorization': 'Bearer ' + token,
                            // },
                            body: JSON.stringify({
                                startDate: selectedStartDate,
                                endDate: selectedEndDate,
                                eventName:'Unavailable to Work',
                                nativeCalId: returnedId
                            }),
                        });
                    }
                    catch (error) {
                        console.error('Error Creating New Event: ', error)
                    }
                } else {
                    console.error('No unique ID created for Event.')
                }

                
                fetchCalEvents();

            } catch (error) {
                console.error('Error adding event:', error)
            }
        } else {
            openSettings();
        }
    };

    const handleDeleteEvent = async (nativeId, id) => {
        try {
            // console.log('WITHIN HANDLE DELETE', id)
            deleteEventsById(nativeId, 'Crew Calendar')
            await fetchAuthWrapper(`http://10.129.3.82:5555/calendarEvents/${id}`, {
                method: 'DELETE',
            })
            const updatedEvents = dbEvents.filter((event) => event.nativeCalId !== id)
            setDBEvents(updatedEvents)
            fetchCalEvents()
        }
        catch (error) {
            console.error('Error adding event:', error)
        }
    }

    // const removeCalendar = () => {
    //     setDBEvents([])
    //     deleteCalendar();
    // }

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <AvailabilitySelector
                    onStartDateSelected={handleStartConfirm}
                    onEndDateSelected={handleEndConfirm}
                    selectedEndDate={selectedEndDate}
                    setSelectedEndDate={setSelectedEndDate}
                    selectedStartDate={selectedStartDate}
                    setSelectedStartDate={setSelectedStartDate}
                    isStartPickerVisible={isStartPickerVisible}
                    setStartPickerVisible={setStartPickerVisible}
                    isEndPickerVisible={isEndPickerVisible}
                    setEndPickerVisible={setEndPickerVisible}
                />
                {(selectedStartDate && selectedEndDate) ? (<TouchableOpacity
                    style={styles.button}
                    underlayColor="#1E88E5" // Color when pressed
                    onPress={() => {
                        handleEventSubmit()
                        setSelectedStartDate(null)
                        setSelectedEndDate(null)
                    }}
                >
                    <Text style={styles.buttonText}>Add Event</Text>
                </TouchableOpacity>
                ) : null }

                {/* <TouchableOpacity
                    style={styles.button}
                    underlayColor="#1E88E5" // Color when pressed
                    onPress={() => {
                        removeCalendar()
                        // navigate.navigate('Login')
                    }}
                >
                    <Text style={styles.buttonText}>Remove Calendar</Text>
                </TouchableOpacity> */}

                {(dbEvents.length > 0) ? dbEvents.map((event, index) => {
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
                                    handleDeleteEvent(event.nativeCalId, event.id)
                                }}
                            >
                                <Text style={styles.buttonText}>Delete Event</Text>
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
        width: 80,
        margin: 5,
    }
});

export default Calendar;