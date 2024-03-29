import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

function AvailabilitySelector ({ 
    onStartDateSelected, 
    onEndDateSelected,
}) {
    const [isStartPickerVisible, setStartPickerVisible] = useState(false);
    const [isEndPickerVisible, setEndPickerVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);

    const showStartPicker = () => {
        setStartPickerVisible(true);
    };
    
    const showEndPicker = () => {
        setEndPickerVisible(true);
    };

    const hideStartPicker = () => {
        setStartPickerVisible(false);
    };

    const hideEndPicker = () => {
        setEndPickerVisible(false);
    };

    const handleStartConfirm = (startDate) => {
        if (!selectedEndDate || startDate.getTime() <= selectedEndDate.getTime()) {
            setSelectedStartDate(startDate);
            onStartDateSelected(startDate)
            hideStartPicker();
        }
    };

    const handleEndConfirm = (endDate) => {
        if (!selectedStartDate || endDate.getTime() >= selectedStartDate.getTime()) {
            setSelectedEndDate(endDate);
            onEndDateSelected(endDate)
            hideEndPicker();
        }
    };

    const formatDate = (date) => {
        const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
        return formattedDate;
    };
    
    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.dateTimePickerButton}
                    onPress={showStartPicker}
                >
                    {(selectedStartDate) ? (
                        <Text style={styles.dateTimePickerButtonText}>Start: {formatDate(selectedStartDate).toString()}</Text>
                    ) : (
                        <Text style={styles.dateTimePickerButtonText}>Choose Start Date</Text>
                    )}
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isStartPickerVisible}
                    mode="date"
                    display="inline"
                    locale="en-ES"
                    minimumDate={new Date()}
                    maximumDate={selectedEndDate}
                    onConfirm={handleStartConfirm}
                    onCancel={hideStartPicker}
                />
            </View>
            <View>
                <TouchableOpacity
                    style={styles.dateTimePickerButton}
                    onPress={showEndPicker}
                >
                    {(selectedEndDate) ? (
                        <Text style={styles.dateTimePickerButtonText}>End: {formatDate(selectedEndDate).toString()}</Text>
                    ) : (
                        <Text style={styles.dateTimePickerButtonText}>Choose End Date</Text>
                    )}
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isEndPickerVisible}
                    mode="date"
                    display="inline"
                    locale="en-ES"
                    minimumDate={selectedStartDate}
                    onConfirm={handleEndConfirm}
                    onCancel={hideEndPicker}
                />
            </View>
        </>
    )
}

const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        margin: 20,
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
}

export default AvailabilitySelector