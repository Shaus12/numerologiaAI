import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const NotificationService = {
    requestPermissions: async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }
        return true;
    },

    scheduleDailyReminder: async () => {
        // Cancel existing to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        const trigger = {
            hour: 9,
            minute: 0,
            repeats: true,
        };

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "הכוכבים מחכים לך 🌌",
                body: "המספר היומי שלך מוכן. היכנס עכשיו כדי לגלות מה מחכה לך היום.",
                sound: true,
            },
            trigger,
        });
    },

    cancelAllNotifications: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    hasPermissions: async () => {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
    }
};
