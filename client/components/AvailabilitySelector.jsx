import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

function AvailabilitySelector ({ onStartDateSelected, onEndDateSelected }) {
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
            <View>
                <Button title="Start Date" onPress={showStartPicker} />
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
                {selectedStartDate && (
                    <Text>Selected Start Date: {formatDate(selectedStartDate).toString()}</Text>
                )}
            </View>
            <View>
                <Button title="End Date" onPress={showEndPicker} />
                <DateTimePickerModal
                    isVisible={isEndPickerVisible}
                    mode="date"
                    display="inline"
                    locale="en-ES"
                    minimumDate={selectedStartDate}
                    onConfirm={handleEndConfirm}
                    onCancel={hideEndPicker}
                />
                {selectedEndDate && (
                    <Text>Selected End Date: {formatDate(selectedEndDate).toString()}</Text>
                )}
            </View>
        </>
    )

}

export default AvailabilitySelector