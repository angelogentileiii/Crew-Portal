


import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// import AvailabilitySelector from '../components/AvailabilitySelector';
import AddEventModal from '../components/AddEventModal';
import useCalendar from '../components/useCalendarHook';
import useFetchAuthWrapper from '../components/fetchAuthWrapper';
import { AuthContext } from '../contextProviders/AuthContext';

function EventCalendar({ navigation }) {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    // const [isStartPickerVisible, setStartPickerVisible] = useState(false);
    // const [isEndPickerVisible, setEndPickerVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
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
            // let token = await SecureStore.getItemAsync('accessToken')
            // console.log('WITHIN USEEFFECT:', token)

            const responseJSON = await fetchAuthWrapper(`http://192.168.1.156:5555/calendarEvents${endpoint}`, {
            // const responseJSON = await fetchAuthWrapper(`http://10.129.3.82:5555/calendarEvents${endpoint}`, {
                method: 'GET',
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

    const handleEventSubmit = async ({ eventName, startDate, endDate }) => {
        const calendarId = await getCalendarId();
        if (!calendarId) {
            await createCalendar();
        }

        if (startDate && endDate) {
            try {
                // let token = await SecureStore.getItemAsync('accessToken')
                // console.log('TOKEN WITHIN SUBMIT:', token)

                // Event added successfully
                const returnedId = await addEventsToCalendar(
                    eventName, 
                    startDate, 
                    endDate,
                    );
                
                if (returnedId) {
                    try {
                        // Send the event data to your backend
                        await fetchAuthWrapper(`http://192.168.1.156:5555/calendarEvents/`, {
                        // await fetchAuthWrapper('http://10.129.3.82:5555/calendarEvents/', {
                            method: 'POST',
                            // headers: {
                            //     'Content-Type': 'application/json',
                            //     'Authorization': 'Bearer ' + token,
                            // },
                            body: JSON.stringify({
                                startDate,
                                endDate,
                                eventName,
                                nativeCalId: returnedId,
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
            await fetchAuthWrapper(`http://192.168.1.156:5555/calendarEvents/${id}`, {
            // await fetchAuthWrapper(`http://10.129.3.82:5555/calendarEvents/${id}`, {
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

    function generateMarkedDates() {
        if (!Array.isArray(dbEvents)) {
            // No events, return an empty object
            return {};
        } else {
            const markedDates = {};

            dbEvents.forEach((event) => {
            // Assuming your events have start and end date fields
                const startDate = event.startDate.split('T')[0]; // Extracting the date part
                const endDate = event.endDate.split('T')[0];
            
                // Parse start and end dates as Date objects
                const startDateTime = new Date(startDate).getTime();
                const endDateTime = new Date(endDate).getTime();
            
                // Loop through the date range and mark each date
                for (let time = startDateTime; time <= endDateTime; time += 24 * 60 * 60 * 1000) {
                    const currentDate = new Date(time);
                    const formattedDate = currentDate.toISOString().split('T')[0];
            
                    markedDates[formattedDate] = {
                    marked: true,
                    dotColor: 'red',
                    };
                }
            });

            return markedDates;
        }
    }

    // const removeCalendar = () => {
    //     setDBEvents([])
    //     deleteCalendar();
    // }

    return (
        <View style={styles.container}>
                {/* Calendar Component */}
                <Calendar
                    style={styles.calendar}
                    markedDates={generateMarkedDates()}
                    onDayPress={(day) => {
                    // Handle day press if needed
                    console.log('Selected day', day);
                    }}
                />
                <ScrollView>

                {/* User's Events */}
                {(dbEvents.length > 0) ? dbEvents.map((event, index) => {
                    return (
                        <View key={index}>
                            <Text>{event.eventName}</Text>
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
            </ScrollView>

            {/* Opens Date Selector Modal */}
            <TouchableOpacity
                    style={styles.addEventButton}
                    underlayColor="#1E88E5"
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.aeButtonText}>+</Text>
                </TouchableOpacity>
            <AddEventModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                handleEventSubmit={handleEventSubmit}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    addEventButton: {
        backgroundColor: '#2196F3', // Button background color
        borderRadius:500,
        padding: '2%',
    },
    addEventButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#2196F3', // Button background color
        borderRadius: 50, // Make it a circle
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    aeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 36,
    },
    calendar: {
        width: '100%'
    }
});

export default EventCalendar;