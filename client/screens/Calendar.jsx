


import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AvailabilitySelector from '../components/AvailabilitySelector';

// import useCalendar from '@atiladev/usecalendar';
import useCalendar from '../components/useCalendarHook';

function Calendar() {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [events, setEvents] = useState([])

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

    const handleStartConfirm = async (startDate) => {
        setSelectedStartDate(startDate);
        const permissionGranted = await getPermission();
        if (!permissionGranted) {
            openSettings();
        }
    };

    console.log(events)

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
                // let eventTag = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
                // Event added successfully
                await addEventsToCalendar(
                    'Unavailable To Work', 
                    selectedStartDate, 
                    selectedEndDate,
                    // eventTag
                    );
                const updatedEvents = await getEvents();
                setEvents([...updatedEvents])
            } catch (error) {
                console.error('Error adding event:', error)
            }
        } else {
            openSettings();
        }
    };

    const handleDeleteEvent = (id) => {
        deleteEventsById(id, 'Crew Calendar')
        events.filter((event) => event.id !== id)
    }

    const removeCalendar = () => {
        setEvents([])
        deleteCalendar();
    }

    return (
        <>
            <View style={styles.container}>
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
                {events.map((event, index) => {
                    console.log('first map', event)
                // return event.map((e, index) => {
                    return (
                        <View key={index}>
                            <Text>ID: {event.id}</Text>
                            <Text>Start: {event.startDate}</Text>
                            <Text>End: {event.endDate}</Text>
                            <TouchableOpacity
                                style={styles.smallButton}
                                underlayColor="#1E88E5" // Color when pressed
                                onPress={() => {
                                    handleDeleteEvent(event.id)
                                }}
                            >
                                <Text style={styles.buttonText}>x</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            {/* )} */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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