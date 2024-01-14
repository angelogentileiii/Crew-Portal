import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AvailabilitySelector from './AvailabilitySelector';

const AddEventModal = ({ navigation, isVisible, onClose, handleEventSubmit }) => {
    const [eventName, setEventName] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);

    const handleAddEvent = () => {
        try {
            handleEventSubmit({
                eventName, 
                startDate: selectedStartDate, 
                endDate: selectedEndDate,
            })
            onClose();
        }
        catch (error) {
            console.log('Error occured adding Event in Modal: ', error)
        }
    };

    return (
        <Modal 
            visible={isVisible}
            transparent={true}
            animationType='slide'
            onBackdropPress={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* <Text style={styles.label}>Event Name:</Text> */}
                    <TextInput
                        style={styles.input}
                        value={eventName}
                        onChangeText={setEventName}
                        placeholder="Enter Event Title"
                        placeholderTextColor={"#000"}
                    />
                    <AvailabilitySelector
                        onStartDateSelected={(date) => setSelectedStartDate(date)}
                        onEndDateSelected={(date) => setSelectedEndDate(date)}
                        selectedEndDate={selectedEndDate}
                        setSelectedEndDate={setSelectedEndDate}
                        selectedStartDate={selectedStartDate}
                        setSelectedStartDate={setSelectedStartDate}
                    />
                    {selectedStartDate !== null && selectedEndDate !== null && (
                        <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
                            <Text style={styles.buttonText}>Add Event</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.secondaryContent}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

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
        padding: 35,
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 20,
        width: 250,
        borderRadius: 8, // Add rounded corners
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        width: 250,
    },
    secondaryButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        width: 250,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: "#2196F3",
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 20,
    },
});

export default AddEventModal;