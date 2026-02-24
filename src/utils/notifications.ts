import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/** Optional: avoid requesting on simulators. Safe if expo-device native module is not linked. */
function isPhysicalDevice(): boolean {
    try {
        const Device = require('expo-device');
        return Device.isDevice === true;
    } catch {
        return true;
    }
}

const DAILY_REMINDER_ID = 'numerologia-daily-morning';

const HEBREW_DAILY_TEASERS = [
    'המספר היומי שלך התעדכן, בוא לגלות מה האנרגיה שלך להיום...',
    'יש משהו שאתה חייב לדעת על היום הזה לפי הנומרולוגיה...',
    'ההדרכה היומית שלך מוכנה.',
    'הכוכבים מחכים לך – גלה את המסר היומי שלך.',
    'האנרגיה הנומרולוגית של היום מתגלה עכשיו.',
    'היום יש מספר שמנחה אותך – בוא לראות.',
];

/**
 * Configure how notifications are presented when the app is in the foreground.
 * Call this once at app startup (e.g. from App.tsx or when the utility is first used).
 */
export function configureNotificationHandler(): void {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

/**
 * Request notification permissions using expo-device and expo-notifications.
 * Safe to call multiple times; only prompts if not yet determined.
 * Returns true if permission granted, false otherwise (or if not a physical device).
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!isPhysicalDevice()) {
        return false;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminder', {
            name: 'Daily reminder',
            importance: Notifications.AndroidImportance.HIGH,
            sound: true,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

/**
 * Clear any existing scheduled notifications, then schedule a daily repeating
 * local notification at 08:00 AM. Uses a random Hebrew teaser from the list.
 * Call after permission is granted (e.g. from requestNotificationPermissions).
 */
export async function scheduleDailyMorningReminder(): Promise<void> {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminder', {
            name: 'Daily reminder',
            importance: Notifications.AndroidImportance.HIGH,
            sound: true,
            vibrationPattern: [0, 250, 250, 250],
        });
    }
    await Notifications.cancelAllScheduledNotificationsAsync();

    const body = HEBREW_DAILY_TEASERS[Math.floor(Math.random() * HEBREW_DAILY_TEASERS.length)];

    await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
        content: {
            title: 'Numerologia AI',
            body,
            sound: true,
            data: { screen: 'Home', openDailyInsight: true },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 8,
            minute: 0,
            channelId: Platform.OS === 'android' ? 'daily-reminder' : undefined,
        },
    });
}
