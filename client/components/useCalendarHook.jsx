import * as Calendar from 'expo-calendar';
import { Linking, Platform } from 'react-native';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook is an a slight manipulation from the library created by AtilaDev (Leandro Favre & Aman Mittal).
// All credit for the main code of this component is from the following repository.
// GitHub Link: https://github.com/AtilaDev-team/useCalendar

const useCalendar = (title, color, storeName) => {
    const _getDefaultCalendarSource = async () => {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    };

    const _storeCalendar = async (storeName, calendarId) => {
        try {
            await AsyncStorage.setItem(storeName, calendarId);
        } catch (e) {}
    };

    const _getCalendarStored = async (storeName) => {
        try {
            const calendarStored = await AsyncStorage.getItem(storeName);
            if (calendarStored !== null) return calendarStored;
        } catch (e) {}
    };

    const openSettings = () => Linking.openSettings();

    const getPermission = async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(
                Calendar.EntityTypes.EVENT
            );
            return calendars;
        }
    };

    const createCalendar = async () => {
        const defaultCalendarSource =
            Platform.OS === 'ios'
                ? await _getDefaultCalendarSource()
                : { isLocalAccount: true, name: title };

        const thereIsACalendar = await _getCalendarStored(storeName);

        if (!thereIsACalendar) {
            const newCalendarID = await Calendar.createCalendarAsync({
                title,
                color,
                entityType: Calendar.EntityTypes.EVENT,
                sourceId: defaultCalendarSource.id,
                source: defaultCalendarSource,
                name: storeName,
                ownerAccount: 'personal',
                accessLevel: Calendar.CalendarAccessLevel.OWNER,
            });
            _storeCalendar(storeName, newCalendarID);
        }
    };

    const deleteCalendar = async () => {
        try {
            const calendarId = await _getCalendarStored(storeName);
            if (calendarId) {
                await Calendar.deleteCalendarAsync(calendarId);
                await AsyncStorage.removeItem(storeName);
            }
        } catch (e) {}
    };

    const addEventsToCalendar = async (
        eventTitle,
        eventStartDate,
        eventEndDate,
    ) => {
        const thereIsACalendar = await _getCalendarStored(storeName);

        if (thereIsACalendar) {
            // const uniqueTag = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

            const event = {
                title: eventTitle,
                startDate: eventStartDate,
                allDay: true,
                endDate: eventEndDate,
                timeZone: Localization.timezone,
                // notes: uniqueTag,
                alarms: [
                    {
                        relativeOffset: 0,
                        method: Calendar.AlarmMethod.ALERT,
                    },
                ],
            };

            try {
                await Calendar.createEventAsync(thereIsACalendar, event);
            } catch (e) {}
        }
    };

    const isThereEvents = async () => {
        const thereIsACalendar = await _getCalendarStored(storeName);
        let thereIs = [];
        if (thereIsACalendar) {
            thereIs = await Calendar.getEventsAsync(
                [thereIsACalendar],
                new Date(2021, 0),
                new Date(new Date().getFullYear() + 1, 0)
            );
        }
        return thereIs.length !== 0;
    };

    const getEvents = async () => {
        const thereIsACalendar = await _getCalendarStored(storeName);
        let thereIs = [];
        if (thereIsACalendar) {
            thereIs = await Calendar.getEventsAsync(
                [thereIsACalendar],
                new Date(2021, 0),
                new Date(new Date().getFullYear() + 1, 0)
            );
        }
        return thereIs;
    };

    const deleteEventsById = async (id, storeName) => {
        try {
            const calendarId = await _getCalendarStored(storeName);
            if (!calendarId) return;
    
            const events = await Calendar.getEventsAsync(
                [calendarId],
                new Date(2021, 0),
                new Date(new Date().getFullYear() + 1, 0)
            );

            console.log('Before Deletion: ', events)
    
            const eventsToDelete = events.filter((event) => event.id === id);
    
            if (eventsToDelete.length > 0) {
                const eventIds = eventsToDelete.map((event) => event.id);
                await Promise.all(
                    eventIds.map(async (eventId) => {
                        await Calendar.deleteEventAsync(eventId);
                    })
                );
            }

            console.log('After Deletion: ', events)
        } catch (e) {
            console.error('Error deleting events:', e);
        }
    };

    const getCalendarId = async () => {
        return await _getCalendarStored(storeName);
    };

    return {
        addEventsToCalendar,
        createCalendar,
        deleteCalendar,
        getCalendarId,
        getEvents,
        getPermission,
        isThereEvents,
        openSettings,
        deleteEventsById,
    };
};

export default useCalendar;