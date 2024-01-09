import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

function AvailabilitySelector () {
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

    const handleStartConfirm = (date) => {
        console.log('A start date has been picked: ', date);
        setSelectedStartDate(date);
        hideStartPicker();
    };

    const handleEndConfirm = (endDate) => {
        if (selectedStartDate && endDate < selectedStartDate) {
          // If the selected end date is earlier than the start date
          // You can display an error message, prevent setting the end date, or handle it accordingly
            console.warn("End date cannot be earlier than the start date");
          // Optionally, you might want to show an error message or prevent setting the end date
          // You can add your custom logic here
        } else {
          // Set the end date if it's valid
            console.log('An end date has been picked: ', endDate);
            setSelectedEndDate(endDate);
            hideEndPicker();
        }
    };
    
    return (
        <>
            <View>
                <Button title="Start Date" onPress={showStartPicker} />
                <DateTimePickerModal
                    isVisible={isStartPickerVisible}
                    mode="datetime"
                    display="inline"
                    onConfirm={handleStartConfirm}
                    onCancel={hideStartPicker}
                    maximumDate={selectedEndDate}
                />
                {selectedStartDate && (
                    <Text>Selected Start Date: {selectedStartDate.toString()}</Text>
                )}
            </View>
            <View>
                <Button title="End Date" onPress={showEndPicker} />
                <DateTimePickerModal
                    isVisible={isEndPickerVisible}
                    mode="datetime"
                    display="inline"
                    onConfirm={handleEndConfirm}
                    onCancel={hideEndPicker}
                    minimumDate={selectedStartDate}
                />
                {selectedEndDate && (
                    <Text>Selected End Date: {selectedEndDate.toString()}</Text>
                )}
            </View>
        </>
    )

}

export default AvailabilitySelector