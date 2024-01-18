import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';

import AvailabilitySelector from './AvailabilitySelector';

function CrewListModal ({ 
    isModalVisible, 
    setModalVisible,
    isDatePickerVisible,
    setDatePickerVisible,
    handleStartDateSelected, 
    handleDateSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    formatDate
}) {

    // const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isDateRangeSelected, setDateRangeSelected] = useState(false);
        
    return (
        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalContainer}>

                {/* Check box for single date vs. date range */}
                <View style={styles.modalContent}>
                    <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={[styles.checkBox, !isDateRangeSelected ? styles.activeCheckBox : null]}
                                onPress={() => setDateRangeSelected(false)}
                            >
                            </TouchableOpacity>
                        <Text>Single Day</Text>
                            <TouchableOpacity
                                style={[styles.checkBox, isDateRangeSelected ? styles.activeCheckBox: null]}
                                onPress={() => setDateRangeSelected(true)}
                            >
                            </TouchableOpacity>
                        <Text>Range of Dates</Text>
                    </View>

                    {isDateRangeSelected ? (
                        // multiple date search
                        <>
                            <AvailabilitySelector
                                onStartDateSelected={(date) => setStartDate(date)}
                                onEndDateSelected={(date) => setEndDate(date)}
                            />
                            {startDate !== null && endDate !== null && (
                                <TouchableOpacity style={styles.dateTimePickerButton} onPress={() => {
                                    handleDateSearch(startDate, endDate)
                                    setModalVisible(false) 
                                }}>
                                    <Text style={styles.dateTimePickerButtonText}>Search Date Range</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Singular Date Search */}
                            <TouchableOpacity
                                style={styles.dateTimePickerButton}
                                onPress={() => setDatePickerVisible(true)}
                            >
                                {(startDate) ? (
                                    <Text style={styles.dateTimePickerButtonText}>{formatDate(startDate).toString()}</Text>
                                ) : (
                                    <Text style={styles.dateTimePickerButtonText}>Choose Date</Text>
                                )}
                            </TouchableOpacity>
                            {startDate !== null && (
                                <TouchableOpacity style={styles.searchButton} onPress={() => {
                                    handleDateSearch(startDate)
                                    setModalVisible(false)
                                    }}>
                                    <Text style={styles.dateTimePickerButtonText}>Search</Text>
                                </TouchableOpacity>
                            )}
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                display="inline"
                                locale="en-ES"
                                minimumDate={new Date()}
                                onConfirm={handleStartDateSelected}
                                onCancel={() => setDatePickerVisible(false)}
                            />
                        </>
                    )}

                </View>

                {/* Cancel Button */}
                <View style={styles.secondaryContent}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </Modal>
    )
}

const styles = StyleSheet.create({
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
})

export default CrewListModal