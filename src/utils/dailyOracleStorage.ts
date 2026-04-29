import AsyncStorage from '@react-native-async-storage/async-storage';

export type DailyOracleInsight = {
    cosmicMessage: string;
    energyScore: number;
    luckyHour: string;
    luckyColor: string;
};

export type StoredDailyOracleInsight = DailyOracleInsight & {
    dateKey: string;
    source: 'ai' | 'life-path-fallback';
};

const DAILY_ORACLE_STORAGE_PREFIX = 'daily_oracle_v1';

function pad2(n: number): string {
    return n < 10 ? `0${n}` : String(n);
}

export function getTodayDateKey(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
}

function normalizeLifePath(n: number | string): number {
    const value = typeof n === 'string' ? parseInt(n, 10) : n;
    if (Number.isFinite(value) && value >= 1 && value <= 9) return Math.floor(value);
    return 9;
}

function normalizeFocusArea(focusArea?: string): string {
    return (focusArea ?? '').trim().toLowerCase();
}

function storageKey(args: {
    dateKey: string;
    lifePath: number | string;
    language: string;
    focusArea?: string;
}): string {
    const lp = normalizeLifePath(args.lifePath);
    const lang = (args.language || 'English').trim();
    const focus = normalizeFocusArea(args.focusArea);
    return `${DAILY_ORACLE_STORAGE_PREFIX}:${args.dateKey}:${lang}:${lp}:${focus}`;
}

function normalizeInsight(input: Partial<DailyOracleInsight>): DailyOracleInsight {
    return {
        cosmicMessage: (input.cosmicMessage ?? '').trim(),
        energyScore:
            typeof input.energyScore === 'number' && input.energyScore >= 1 && input.energyScore <= 100
                ? Math.round(input.energyScore)
                : 50,
        luckyHour: (input.luckyHour ?? '').trim() || '—',
        luckyColor: (input.luckyColor ?? '').trim() || '—',
    };
}

export async function loadTodayOracleInsight(args: {
    lifePath: number | string;
    language: string;
    focusArea?: string;
}): Promise<StoredDailyOracleInsight | null> {
    const dateKey = getTodayDateKey();
    const key = storageKey({ ...args, dateKey });
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as Partial<StoredDailyOracleInsight>;
        const insight = normalizeInsight(parsed);
        if (!insight.cosmicMessage) return null;
        return {
            ...insight,
            dateKey,
            source: parsed.source === 'ai' ? 'ai' : 'life-path-fallback',
        };
    } catch {
        return null;
    }
}

export async function saveTodayOracleInsight(
    args: {
        lifePath: number | string;
        language: string;
        focusArea?: string;
    },
    insight: DailyOracleInsight,
    source: 'ai' | 'life-path-fallback',
): Promise<void> {
    const dateKey = getTodayDateKey();
    const key = storageKey({ ...args, dateKey });
    const payload: StoredDailyOracleInsight = {
        ...normalizeInsight(insight),
        dateKey,
        source,
    };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
}

const LIFE_PATH_FALLBACK_MESSAGES: Record<number, string> = {
    1: 'היום האנרגיה שלך מבקשת יוזמה. צעד/י ראשון באומץ ופתח/י דלת חדשה - היקום יגיב לתנועה שלך.',
    2: 'היום מביא תדר של רכות וחיבור. הקשבה אמיתית ושיתוף פעולה מדויק יפתחו עבורך את השער הנכון.',
    3: 'היום הוא יום של ביטוי. כשאת/ה נותן/ת לקול הפנימי שלך מקום, המציאות מסתדרת סביב המסר שלך.',
    4: 'היום מחזק יציבות וסדר. בחירה אחת מעשית וממוקדת תבנה עבורך בסיס בטוח להמשך.',
    5: 'היום קורא לגמישות ולחידוש. שינוי קטן בגישה יכול להפוך להזדמנות גדולה במיוחד עבורך.',
    6: 'היום מאיר אחריות ואהבה. פעולה אחת של דאגה - לעצמך או לאחר - תחזיר אליך איזון עמוק.',
    7: 'היום מבקש שקט ובהירות. קח/י רגע להתבוננות פנימית, ומשם יופיע הכיוון המדויק הבא שלך.',
    8: 'היום נושא כוח והשפעה. החלטה ברורה ואמיצה תסמן ליקום שאת/ה מוכן/ה לעלות שלב.',
    9: 'היום מתאים לשחרור ולהשלמה. סגירה של מעגל ישן תפנה מקום לברכה חדשה להיכנס.',
};

export function buildLifePathFallbackInsight(lifePath: number | string, focusArea?: string): DailyOracleInsight {
    const lp = normalizeLifePath(lifePath);
    const base = LIFE_PATH_FALLBACK_MESSAGES[lp] || LIFE_PATH_FALLBACK_MESSAGES[9];
    const focus = normalizeFocusArea(focusArea);
    const focusLine = focus ? ` הפוקוס שלך היום: ${focus}.` : '';
    return {
        cosmicMessage: `${base}${focusLine}`,
        energyScore: 72,
        luckyHour: '11:11',
        luckyColor: 'זהב ירחי',
    };
}
