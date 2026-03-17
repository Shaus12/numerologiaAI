import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { translations, type Language } from './translations';

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

function getDailyReminderBody(language: Language): string {
    const langTranslations = translations[language] || translations['English'];
    return langTranslations['dailyReminderBody'] || translations['English']['dailyReminderBody'] || 'Your daily insight is ready.';
}

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
 * local notification at 08:00 AM. Body text uses the user's selected language.
 * Call after permission is granted (e.g. from requestNotificationPermissions).
 */
export async function scheduleDailyMorningReminder(language: Language): Promise<void> {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminder', {
            name: 'Daily reminder',
            importance: Notifications.AndroidImportance.HIGH,
            sound: true,
            vibrationPattern: [0, 250, 250, 250],
        });
    }
    await Notifications.cancelAllScheduledNotificationsAsync();

    const body = getDailyReminderBody(language);

    await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
        content: {
            title: 'Echoes: Numerology Map',
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
