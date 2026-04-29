import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { translations, type Language } from './translations';
import { NumerologyEngine } from './numerology';

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

// Stable identifiers for the 3-day trial retention sequence
const TRIAL_RETENTION_IDS = [
    'numerologia-trial-day1-morning',   // Tomorrow 08:00 → Home
    'numerologia-trial-day1-evening',   // Tomorrow 20:00 → Vault
    'numerologia-trial-day2-morning',   // Day after tomorrow 08:00 → Oracle
] as const;

type TrialRetentionId = (typeof TRIAL_RETENTION_IDS)[number];

// Deep-link screen targets carried in notification data payloads
export type NotificationScreen = 'Home' | 'Vault' | 'Oracle' | 'Forecast';

function getStr(language: Language, key: string): string {
    const lang = translations[language] ?? translations['English'];
    return lang[key] ?? translations['English'][key] ?? '';
}

/**
 * Configure how notifications are presented when the app is in the foreground.
 * Call once at app startup.
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
 * Request notification permissions.
 * Safe to call multiple times; only prompts if not yet determined.
 * Returns true if permission granted.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!isPhysicalDevice()) return false;

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

async function ensureAndroidChannel(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Daily reminder',
        importance: Notifications.AndroidImportance.HIGH,
        sound: true,
        vibrationPattern: [0, 250, 250, 250],
    });
}

/**
 * Reschedule the daily reminder if permission is already granted.
 * Use after language changes without re-showing the system prompt.
 * NOTE: only cancels/replaces the daily reminder — trial retention is untouched.
 */
export async function scheduleDailyMorningReminderIfGranted(language: Language): Promise<void> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    await scheduleDailyMorningReminder(language);
}

/**
 * (Re)schedule the daily repeating morning reminder at 08:00.
 * Cancels only its own previous instance — does NOT touch trial retention notifications.
 */
export async function scheduleDailyMorningReminder(language: Language): Promise<void> {
    await ensureAndroidChannel();

    // Cancel only this specific notification, not the whole queue
    try {
        await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
    } catch (_) {}

    const body =
        getStr(language, 'dailyReminderBody') || 'Your daily insight is ready.';

        const title =
        getStr(language, 'dailyReminderTitle') || 'Echoes: Numerology Map';

    await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
        content: {
            title,
            body,
            sound: true,
            data: { screen: 'Home' as NotificationScreen, openDailyInsight: true },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 8,
            minute: 0,
            channelId: Platform.OS === 'android' ? 'daily-reminder' : undefined,
        },
    });
}

// ---------------------------------------------------------------------------
// Trial retention sequence
// ---------------------------------------------------------------------------

/**
 * Returns a Date set to `daysFromNow` days from now at the given local hour/minute.
 */
function triggerDate(daysFromNow: number, hour: number, minute: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, minute, 0, 0);
    return d;
}

/**
 * Cancel any previously scheduled trial retention notifications.
 * Safe to call even if none were ever scheduled.
 */
export async function cancelTrialRetentionNotifications(): Promise<void> {
    await Promise.all(
        TRIAL_RETENTION_IDS.map((id: TrialRetentionId) =>
            Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
        ),
    );
}

/**
 * Schedule the 3-push trial retention sequence immediately after the user
 * starts a free trial.  Requires notification permission to already be granted.
 *
 * Push 1 — Tomorrow 08:00  →  Home
 * Push 2 — Tomorrow 20:00  →  Vault
 * Push 3 — Day after tomorrow 08:00  →  Oracle
 */
export async function scheduleTrialRetentionNotifications(
    language: Language,
): Promise<void> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    await ensureAndroidChannel();

    // Clear any previous run of this sequence (idempotent re-trigger safety)
    await cancelTrialRetentionNotifications();

    const channelId =
        Platform.OS === 'android' ? 'daily-reminder' : undefined;

    const pushes: Array<{
        id: TrialRetentionId;
        titleKey: string;
        bodyKey: string;
        screen: NotificationScreen;
        daysFromNow: number;
        hour: number;
    }> = [
        {
            id: 'numerologia-trial-day1-morning',
            titleKey: 'retentionPush1Title',
            bodyKey: 'retentionPush1Body',
            screen: 'Home',
            daysFromNow: 1,
            hour: 8,
        },
        {
            id: 'numerologia-trial-day1-evening',
            titleKey: 'retentionPush2Title',
            bodyKey: 'retentionPush2Body',
            screen: 'Vault',
            daysFromNow: 1,
            hour: 20,
        },
        {
            id: 'numerologia-trial-day2-morning',
            titleKey: 'retentionPush3Title',
            bodyKey: 'retentionPush3Body',
            screen: 'Oracle',
            daysFromNow: 2,
            hour: 8,
        },
    ];

    for (const { id, titleKey, bodyKey, screen, daysFromNow, hour } of pushes) {
        await Notifications.scheduleNotificationAsync({
            identifier: id,
            content: {
                title: getStr(language, titleKey),
                body: getStr(language, bodyKey),
                sound: true,
                data: { screen } satisfies { screen: NotificationScreen },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate(daysFromNow, hour, 0),
                channelId,
            },
        });
        await delay(1000);
    }
}

// ---------------------------------------------------------------------------
// 30-day paying subscriber journey (08:30; copy in `translations`: subJourney_day1…30, branchLabel_*)
// ---------------------------------------------------------------------------

const SUBSCRIBER_JOURNEY_PREFIX = 'sub-journey-';
const SUBSCRIBER_JOURNEY_DAYS = 30;
const SUBSCRIBER_JOURNEY_HOUR = 8;
const SUBSCRIBER_JOURNEY_MINUTE = 30;
const SUBSCRIBER_NOTIFICATION_TITLE_FALLBACK = 'Echoes: Numerology Map';
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function clampLifePathForNotifications(n: number): number {
    if (Number.isFinite(n) && n >= 1 && n <= 9) return Math.floor(n);
    return 9;
}

/** Replace `{{lifePath}}` and `{{branch}}` in subscriber journey templates from `translations`. */
export function interpolateSubJourneyTemplate(
    template: string,
    lifePath: number,
    branch: string,
): string {
    return template
        .replace(/\{\{lifePath\}\}/g, String(lifePath))
        .replace(/\{\{branch\}\}/g, branch);
}

function subscriberBranchLabel(branchId: string, language: Language): string {
    const key = `branchLabel_${branchId}`;
    let label = getStr(language, key);
    if (!label) label = getStr(language, 'branchLabel_default');
    return label || getStr('English', 'branchLabel_default') || 'your focus';
}

function subscriberJourneyBodyForDay(
    dayIndex1: number,
    language: Language,
    lifePath: number,
    branch: string,
): string {
    const template = getStr(language, `subJourney_day${dayIndex1}`);
    return interpolateSubJourneyTemplate(template, lifePath, branch);
}

/**
 * Cancel generic 08:00 daily reminder and any `sub-journey-*` notifications.
 */
export async function clearSubscriberJourneyNotifications(): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
    } catch {
        /* noop */
    }

    for (let d = 1; d <= SUBSCRIBER_JOURNEY_DAYS; d++) {
        try {
            await Notifications.cancelScheduledNotificationAsync(`${SUBSCRIBER_JOURNEY_PREFIX}${d}`);
        } catch {
            /* noop */
        }
    }

    try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        await Promise.all(
            scheduled
                .filter((n) => n.identifier.startsWith(SUBSCRIBER_JOURNEY_PREFIX))
                .map((n) =>
                    Notifications.cancelScheduledNotificationAsync(n.identifier).catch(() => undefined),
                ),
        );
    } catch {
        /* noop */
    }
}

/**
 * 30-day localized morning sequence (08:30) for paying subscribers.
 * Bodies and branch labels come from `translations` (`subJourney_day1`…`subJourney_day30`, `branchLabel_*`).
 * `getStr` falls back to English when a locale has not translated a day yet.
 *
 * Does not modify {@link scheduleTrialRetentionNotifications}.
 *
 * @param language Must match a key of `translations` (e.g. `'English'`). Runtime string values from the app’s language state are valid.
 */
export async function scheduleSubscriberJourney(
    lifePathNumber: number,
    branchId: string,
    language: Language,
): Promise<void> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    await ensureAndroidChannel();
    await clearSubscriberJourneyNotifications();

    const lp = clampLifePathForNotifications(lifePathNumber);
    const branch = subscriberBranchLabel(branchId, language);
    const title =
        getStr(language, 'subJourneyNotificationTitle') || SUBSCRIBER_NOTIFICATION_TITLE_FALLBACK;
    const channelId = Platform.OS === 'android' ? 'daily-reminder' : undefined;

    for (let day = 1; day <= SUBSCRIBER_JOURNEY_DAYS; day++) {
        const body = subscriberJourneyBodyForDay(day, language, lp, branch);
        await Notifications.scheduleNotificationAsync({
            identifier: `${SUBSCRIBER_JOURNEY_PREFIX}${day}`,
            content: {
                title,
                body,
                sound: true,
                data: {
                    screen: 'Home' as NotificationScreen,
                    openDailyInsight: true,
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate(day, SUBSCRIBER_JOURNEY_HOUR, SUBSCRIBER_JOURNEY_MINUTE),
                channelId,
            },
        });
        await delay(1000);
    }
}

// ---------------------------------------------------------------------------
// Monthly Forecast Journey
// ---------------------------------------------------------------------------

export async function scheduleMonthlyForecastNotifications(
    lifePath: number,
    birthDate: Date | string,
    branchId: string,
    language: Language,
): Promise<void> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;

    await ensureAndroidChannel();

    const channelId = Platform.OS === 'android' ? 'daily-reminder' : undefined;

    // Clear previous forecast notifications
    for (let d = 1; d <= 12; d++) {
        try {
            await Notifications.cancelScheduledNotificationAsync(`monthly-forecast-month-${d}`);
        } catch {
            /* noop */
        }
    }

    const d = new Date();
    const currentYear = d.getFullYear();
    const currentMonth = d.getMonth();

    const pushes: Date[] = [];
    let scheduledCount = 0;
    let monthOffset = 0;

    // Determine the next 12 dates (1st of each month at 09:00 AM)
    while (scheduledCount < 12) {
        const targetDate = new Date(currentYear, currentMonth + monthOffset, 1, 9, 0, 0, 0);
        if (targetDate > new Date()) {
            pushes.push(targetDate);
            scheduledCount++;
        }
        monthOffset++;
    }

    const branchLabel = subscriberBranchLabel(branchId, language);
    const baseTemplate = getStr(language, 'monthlyForecastPushBody') || 
        "A new month has begun! Your Personal Month {{personalMonth}} energy is shifting. The Oracle has a specific insight for your {{branch}}. See it now.";

    for (let i = 0; i < pushes.length; i++) {
        const date = pushes[i];
        const triggerYear = date.getFullYear();
        const triggerMonth = date.getMonth() + 1; // 1-12

        const py = NumerologyEngine.calculatePersonalYear(birthDate, triggerYear);
        const pm = NumerologyEngine.calculatePersonalMonth(py, triggerMonth);

        const body = baseTemplate
            .replace(/\{\{personalMonth\}\}/g, String(pm))
            .replace(/\{\{branch\}\}/g, branchLabel);

        await Notifications.scheduleNotificationAsync({
            identifier: `monthly-forecast-month-${i + 1}`,
            content: {
                title: getStr(language, 'monthlyForecastPushTitle') || "Echoes: Monthly Forecast",
                body,
                sound: true,
                data: { screen: 'Forecast' as NotificationScreen },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date,
                channelId,
            },
        });
        await delay(1000);
    }
}