import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// import AvailabilitySelector from '../components/AvailabilitySelector';
import AddEventModal from '../components/AddEventModal';
import useCalendar from '../components/useCalendarHook';
import useFetchAuthWrapper from '../components/fetchAuthWrapper';
import { AuthContext } from '../contextProviders/AuthContext';

function EventCalendar({ navigation, isModalVisible, setModalVisible }) {
    const [selectedDay, setSelectedDay] = useState(null)
    const [showAllEvents, setShowAllEvents] = useState(false);

    console.log(isModalVisible)
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

    const displayEvents = () => {
        if (dbEvents.length > 0) {
            if (selectedDay && !showAllEvents) {
                const filteredEvents = dbEvents.filter((event) => {

                    const eventStart = event.startDate.split('T')[0];
                    const eventEnd = event.endDate.split('T')[0];
                    const selectedDate = selectedDay

                    return selectedDate >= eventStart && selectedDate <= eventEnd;
                });
        
                return (
                    <ScrollView 
                    style={styles.scrollViewContainer}
                    contentContainerStyle={styles.scrollViewContent}
                    >
                        {filteredEvents.map((event, index) => (
                            <View key={index} style={styles.eventContainer}>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    underlayColor="#1E88E5" // Color when pressed
                                    onPress={() => {
                                        handleDeleteEvent(event.nativeCalId, event.id)
                                    }}
                                >
                                    <Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>
                                <View style={styles.eventInfoContainer}>
                                    <Text>{event.eventName}</Text>
                                    <Text>Start: {event.startDate}</Text>
                                    <Text>End: {event.endDate}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )
            } else {
                return (
                    <ScrollView 
                    style={styles.scrollViewContainer}
                    contentContainerStyle={styles.scrollViewContent}
                    >
                        {dbEvents.map((event, index) => (
                            <View key={index} style={styles.eventContainer}>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    underlayColor="#1E88E5" // Color when pressed
                                    onPress={() => {
                                        handleDeleteEvent(event.nativeCalId, event.id)
                                    }}
                                >
                                    <Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>
                                <View style={styles.eventInfoContainer}>
                                    <Text style={{fontWeight: 'bold'}}>{event.eventName}</Text>
                                    <Text>Start: {event.startDate.split('T')[0]}</Text>
                                    <Text>End: {event.endDate.split('T')[0]}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )
            } 
        } else {
            return (
                <View style={styles.noEventsContainer}>
                    <Text style={styles.noEventsText}>No scheduled events at this time</Text>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
                {selectedDay !== null ? (
                    <Button
                        title="Show All Events"
                        onPress={() => {
                            setShowAllEvents(true)
                            setSelectedDay(null)
                        }}
                    />
                ) : (
                    null
                )}

                {/* Calendar Component */}
                <Calendar
                    style={{
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 10,
                        minWidth: '95%',
                        margin: '2.5%',
                    }}
                    theme={{
                        textMonthFontWeight: 'bold',
                    }}
                    enableSwipeMonths={true}
                    markingType={'period'}
                    markedDates={generateMarkedDates()}
                    onDayPress={(day) => {
                        console.log('Selected day', day.dateString);
                        setShowAllEvents(false)
                        setSelectedDay(day.dateString)
                    }}
                />
                {displayEvents()}
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
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    scrollViewContainer: {
        flex: 1,
        width: '95%',
        backgroundColor: '#fff'
    },
    scrollViewContent: {
        alignItems: 'center',
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    eventInfoContainer: {
        marginRight: 5,
    },
    noEventsContainer: {
        alignItems: 'center',
        width: '90%',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    noEventsText: {
        fontSize: 16,
        color: '#555',
    },
    deleteButton: {
        backgroundColor: '#2196F3',
        borderRadius: 25,
        width: 25,
        height: 25,
        padding: '2%',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default EventCalendar;


