import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, TextInput } from 'react-native'
import { DateTimePickerModal } from 'react-native-modal-datetime-picker'

import AvailabilitySelector from "../components/AvailabilitySelector";
import { AuthContext } from '../contextProviders/AuthContext';
import useFetchAuthWrapper from "../components/fetchAuthWrapper";
import CrewCard from "../components/CrewCard";
import CrewListModal from "../components/CrewListModal";

function CrewList ({ navigation }) {
    const [crewList, setCrewList] = useState([])
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false)
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndPickerVisible] = useState(false);
    const [isDateRangeSelected, setDateRangeSelected] = useState(false);
    const [filteredCrewList, setFilteredCrewList] = useState([]);
    const [searchText, setSearchText] = useState('')


    const authContext = useContext(AuthContext)
    const { checkAccessToken } = authContext

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation })

    const URL = 'http://192.168.1.156:5555'
    // const URL = 'http://10.129.3.82:5555'


    const fetchUsers = async () => {
        try {
            await checkAccessToken()
            const allUsers = await fetchAuthWrapper(URL + '/users', {
                method: 'GET'
            })

            setCrewList(allUsers);
            setFilteredCrewList(allUsers);
        }
        catch (error) {
            console.warn('Error fetching Users', error)
        }
    }
    
    useEffect(() => {
        const filteredCrew = crewList.filter((user) =>
            user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.unionNumber.toString().includes(searchText)
        );
        setFilteredCrewList(filteredCrew)
    }, [crewList, searchText])

    const handleStartDateSelected = (startDate) => {
        setStartDate(startDate);
        setDatePickerVisible(false)
    };

    const resetDates = () => {
        setStartDate(null)
        setEndDate(null)
    }

    const handleDateSearch = async (start, end) => {
        try {
            if (start && !end) {
                const formatStartDate = start.toISOString().split("T")[0];
                console.log('FORMATTED: ', formatStartDate)

                const responseJSON = await fetchAuthWrapper(URL + `/users/availableUsers?startDate=${formatStartDate}`, {
                    method: 'GET'
                })

                console.log('AVAILABLE USERS: ', responseJSON)
                setCrewList(responseJSON)
            } else if (start && end) {
                const formatStartDate = start.toISOString().split("T")[0];
                const formatEndDate = end.toISOString().split("T")[0];

                const responseJSON = await fetchAuthWrapper(URL + `/users/availableUsers?startDate=${formatStartDate}&endDate=${formatEndDate}`, {
                    method: 'GET'
                })

                setCrewList(responseJSON)
            } else {
                console.log('Missing Start Date')
            }
        }
        catch (error) {
            console.log('Error Occuring in HandleSearch: ', error)
        }
    }

    const formatDate = (date) => {
        const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
        return formattedDate;
    };

    // update the info every time the screen is navigated to (focused)
    useEffect(() => {
        const screenFocus = navigation.addListener('focus', () => {
            fetchUsers();
        });

        // Cleanup the listener when the component is unmounted
        return () => {
            screenFocus();
        };
    }, [navigation]);

    const crewInfo = filteredCrewList.map((crewMember) => {
        const { id } = crewMember
        return <CrewCard key={id} navigation={navigation} crewMember={crewMember} />
    })

    return (
        <View style={styles.container}>
            {/* SEARCH BAR */}
            <TextInput
                style={styles.input}
                placeholder="Search for Crew"
                placeholderTextColor='#000'
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* readjust this button later for styling */}
            <TouchableOpacity
                style={styles.dateTimePickerButton}
                onPress={() => setModalVisible(true)}
            >
                {startDate !== null && endDate !== null ? (
                    <Text style={styles.dateTimePickerButtonText}>From: {formatDate(startDate).toString()} to {formatDate(endDate).toString()}</Text>
                ) : startDate !== null ? (
                    <Text style={styles.dateTimePickerButtonText}>Selected Date: {formatDate(startDate).toString()}</Text>
                ) : (
                    <Text style={styles.dateTimePickerButtonText}>Search by Availability</Text>
                )}
            </TouchableOpacity>

            <CrewListModal 
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                isModalVisible={isModalVisible} 
                setModalVisible={setModalVisible}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisible={setDatePickerVisible}
                handleDateSearch={handleDateSearch} 
                handleStartDateSelected={handleStartDateSelected}
                formatDate={formatDate}
            />

            {startDate !== null ? (
                // Add Reset button here
                <TouchableOpacity style={styles.searchButton} onPress={() => {
                    fetchUsers()
                    resetDates()
                }}>
                    <Text style={styles.dateTimePickerButtonText}>Reset Dates</Text>
                </TouchableOpacity>
            ) : ( 
                null 
            )}

            
            <ScrollView style={styles.scrollContainer}>
                {crewInfo}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        // backgroundColor: 'red',
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
    scrollContainer: {
        flex: 1,
        width: '100%',
        // paddingVertical: 20,
        marginBottom: '.25%',
        // paddingBottom: 20,
        backgroundColor: '#fff',
        // backgroundColor: 'blue',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingBottom: '9%',
    },
    modalContent: {
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 15,
        // padding: 35,
        // marginVertical: '5%',
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
        width: '95%',
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
    secondaryButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        width: 250,
    },
    secondaryButtonText: {
        color: "#2196F3",
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkBox: {
        width: 15,
        height: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 20, 
    },
    activeCheckBox: {
        backgroundColor: '#2196F3',
    },
    dateTimePickerButton: {
        backgroundColor: '#2196F3', // Button background color
        padding: 12,
        borderRadius: 8, // Add rounded corners to match inputs
        width: 250,
        marginBottom: 20,
    },
    dateTimePickerButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: '#2196F3', // Button background color
        padding: 12,
        borderRadius: 8, // Add rounded corners to match inputs
        width: 250,
        marginBottom: 20,
    },
});


export default CrewList