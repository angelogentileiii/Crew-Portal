import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Button } from 'react-native'
import { Calendar } from 'react-native-calendars';

import useFetchAuthWrapper from '../components/fetchAuthWrapper';
import { AuthContext } from '../contextProviders/AuthContext';

function UserAvailability ({ route, navigation }) {
    const [userEvents, setUserEvents] = useState([])
    const [selectedDay, setSelectedDay] = useState(null)
    const [showAllEvents, setShowAllEvents] = useState(false);
    const { id } = route.params

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation })

    const URL = 'http://192.168.1.156:5555'
    // const URL = 'http://10.129.3.82:5555'


    const fetchUserEvents = async () => {
        try {
            const responseJSON = await fetchAuthWrapper(URL + `/calendarEvents/user/${id}`, {
                method: 'GET',
            })

            if (responseJSON) {
                // console.log('AFTER CAL EVENTS FETCH: ', responseJSON)
                setUserEvents(responseJSON)
                console.log('WITHIN USER AVAIL: ', responseJSON)
            } else {
                setUserEvents([])
            }
            
        } catch (error) {
            console.error('Error occurred while fetching:', error);
        }
    }

    // fetch on screen load!
    useEffect(() => {
        fetchUserEvents()
    }, [])

    // mark the dates into the calendar component
    function generateMarkedDates() {
        if (!Array.isArray(userEvents)) {
            // No events, return an empty object
            return {};
        } else {
            const markedDates = {};

            userEvents.forEach((event) => {
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
        if (userEvents.length > 0) {
            if (selectedDay && !showAllEvents) {
                const filteredEvents = userEvents.filter((event) => {

                    const eventStart = event.startDate.split('T')[0];
                    const eventEnd = event.endDate.split('T')[0];
                    const selectedDate = selectedDay

                    return selectedDate >= eventStart && selectedDate <= eventEnd;
                });
        
                return (
                    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollViewContent}>
                        {filteredEvents.map((event, index) => (
                            <View key={index} style={styles.eventContainer}>
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
                    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollViewContent}>
                        {userEvents.map((event, index) => (
                            <View key={index} style={styles.eventContainer}>
                                <View style={styles.eventInfoContainer}>
                                    <Text>{event.eventName}</Text>
                                    <Text>Start: {event.startDate}</Text>
                                    <Text>End: {event.endDate}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )
            } 
        } else {
            return (
                <View style={styles.noEventsContainer}>
                    <Text style={styles.noEventsText}>No scheduled events at this time!</Text>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    scrollViewContainer: {
        width: '95%',
    },
    scrollViewContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '15%',
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
})

export default UserAvailability