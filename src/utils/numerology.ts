// English vowels (Pythagorean: used for Soul Urge = vowels, Personality = consonants)
const ENGLISH_VOWELS = ['A', 'E', 'I', 'O', 'U'];

// Hebrew vowels for Soul Urge / Personality: Aleph, Hey, Vav, Yod (א, ה, ו, י). All other Hebrew letters = consonants.
const HEBREW_VOWELS = ['א', 'ה', 'ו', 'י'];

// Hebrew Mispar Katan (Reduced Gematria) mapping
const HEBREW_LETTER_MAP: Record<string, number> = {};
[
    ['א', 'י', 'ק'],
    ['ב', 'כ', 'ך', 'ר'],
    ['ג', 'ל', 'ש'],
    ['ד', 'מ', 'ם', 'ת'],
    ['ה', 'נ', 'ן'],
    ['ו', 'ס'],
    ['ז', 'ע'],
    ['ח', 'פ', 'ף'],
    ['ט', 'צ', 'ץ'],
].forEach((letters, i) => {
    const value = i + 1;
    letters.forEach((c) => { HEBREW_LETTER_MAP[c] = value; });
});

/**
 * Returns calendar day, month, year for a birthdate without timezone shift.
 * ISO strings like "1990-05-15T00:00:00.000Z" are interpreted as the calendar date in the string (YYYY-MM-DD), not UTC.
 */
export function getBirthdateLocalParts(birthdate: string | Date): { year: number; month: number; day: number } {
    if (birthdate instanceof Date) {
        return { year: birthdate.getFullYear(), month: birthdate.getMonth() + 1, day: birthdate.getDate() };
    }
    const s = String(birthdate).trim();
    const match = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
        return {
            year: parseInt(match[1], 10),
            month: parseInt(match[2], 10),
            day: parseInt(match[3], 10),
        };
    }
    const fallback = new Date(birthdate);
    return { year: fallback.getFullYear(), month: fallback.getMonth() + 1, day: fallback.getDate() };
}

export const NumerologyEngine = {
    /**
     * Calculates the Life Path Number (Sum of all digits in birthdate)
     */
    calculateLifePath: (birthdate: string | Date): number => {
        const { day, month, year } = getBirthdateLocalParts(birthdate);

        const sumDigits = (num: number): number => {
            let sum = String(num)
                .split('')
                .reduce((acc, digit) => acc + parseInt(digit), 0);

            if (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
                return sumDigits(sum);
            }
            return sum;
        };

        const finalSum = sumDigits(sumDigits(day) + sumDigits(month) + sumDigits(year));
        return finalSum;
    },

    /**
     * Pythagorean mapping for English letters (A–Z). Unchanged.
     */
    letterMap: {
        A: 1, J: 1, S: 1,
        B: 2, K: 2, T: 2,
        C: 3, L: 3, U: 3,
        D: 4, M: 4, V: 4,
        E: 5, N: 5, W: 5,
        F: 6, O: 6, X: 6,
        G: 7, P: 7, Y: 7,
        H: 8, Q: 8, Z: 8,
        I: 9, R: 9,
    } as Record<string, number>,

    /**
     * Hebrew Mispar Katan (Reduced Gematria) mapping. Used for Hebrew letters only.
     */
    hebrewMap: HEBREW_LETTER_MAP,

    /**
     * Reduces to a single digit or master number (11, 22, 33).
     */
    reduceToDigit: (num: number): number => {
        if (num <= 9 || num === 11 || num === 22 || num === 33) return num;
        return NumerologyEngine.reduceToDigit(
            String(num).split('').reduce((acc, d) => acc + parseInt(d, 10), 0)
        );
    },

    /**
     * Calculates name number (Destiny = all, Soul Urge = vowels, Personality = consonants).
     * Supports both English (Pythagorean) and Hebrew (Mispar Katan) in the same string.
     * Ignores any character not in the English or Hebrew alphabet (spaces, numbers, punctuation).
     */
    calculateNameNumber: (name: string, type: 'all' | 'vowels' | 'consonants'): number => {
        let sum = 0;

        for (const char of name) {
            const upper = char.toUpperCase();
            const isEnglish = NumerologyEngine.letterMap[upper] !== undefined;
            const isHebrew = HEBREW_LETTER_MAP[char] !== undefined;

            if (!isEnglish && !isHebrew) continue;

            const value = isEnglish ? NumerologyEngine.letterMap[upper]! : HEBREW_LETTER_MAP[char]!;
            const isVowel = isEnglish
                ? ENGLISH_VOWELS.includes(upper)
                : HEBREW_VOWELS.includes(char);

            if (type === 'all' || (type === 'vowels' && isVowel) || (type === 'consonants' && !isVowel)) {
                sum += value;
            }
        }

        return NumerologyEngine.reduceToDigit(sum);
    },

    calculateDestiny: (name: string) => NumerologyEngine.calculateNameNumber(name, 'all'),
    calculateSoulUrge: (name: string) => NumerologyEngine.calculateNameNumber(name, 'vowels'),
    calculatePersonality: (name: string) => NumerologyEngine.calculateNameNumber(name, 'consonants'),

    /**
     * Calculates Personal Year Number
     */
    calculatePersonalYear: (birthdate: string | Date, currentYear: number = new Date().getFullYear()): number => {
        const { day, month } = getBirthdateLocalParts(birthdate);

        // Sum reduced parts
        const sum = NumerologyEngine.reduceToSingleDigit(day) + 
                    NumerologyEngine.reduceToSingleDigit(month) + 
                    NumerologyEngine.reduceToSingleDigit(currentYear);
                    
        return NumerologyEngine.reduceToSingleDigit(sum);
    },

    /**
     * Calculates Personal Year strictly for the Cosmic Roadmap based on Life Path + Year
     */
    calculateRoadmapPersonalYear: (lifePath: number, year: number): number => {
        const yearSum = NumerologyEngine.reduceToSingleDigit(year);
        return NumerologyEngine.reduceToSingleDigit(lifePath + yearSum);
    },

    /**
     * Returns a Harmony Score (0-100) representing how well a Personal Year matches a Life Path
     */
    getHarmonyScore: (lifePath: number, personalYear: number): number => {
        const excellentPairs: Record<number, number[]> = {
            1: [1, 5, 7, 8], 2: [1, 2, 4, 6, 8], 3: [3, 5, 6, 9],
            4: [2, 4, 6, 8], 5: [1, 3, 5, 7], 6: [2, 3, 4, 6, 9],
            7: [1, 5, 7, 9], 8: [1, 2, 4, 8], 9: [3, 6, 7, 9]
        };
        
        const challengingPairs: Record<number, number[]> = {
            1: [2, 4, 6], 2: [5, 7, 9], 3: [4, 8],
            4: [1, 3, 5, 9], 5: [2, 4, 6], 6: [1, 5, 7],
            7: [2, 6, 8], 8: [3, 7, 9], 9: [2, 4, 8]
        };
        
        const lpRaw = NumerologyEngine.reduceToSingleDigit(lifePath);
        const pyRaw = NumerologyEngine.reduceToSingleDigit(personalYear);
        
        let baseScore = 65; // Default neutral
        if (excellentPairs[lpRaw]?.includes(pyRaw)) baseScore = 90;
        else if (challengingPairs[lpRaw]?.includes(pyRaw)) baseScore = 40;
        
        // Add a deterministic semi-random fluctuation based on the numbers themselves to make it feel organic without Math.random() jumping on re-renders
        return Math.min(100, Math.max(0, baseScore + ((lpRaw * pyRaw) % 10) - 5));
    },

    /**
     * Calculates Personal Month Number
     */
    calculatePersonalMonth: (personalYear: number, currentMonth: number = new Date().getMonth() + 1): number => {
        // Reduced Personal Year + Reduced Calendar Month
        const sum = NumerologyEngine.reduceToSingleDigit(personalYear) + 
                    NumerologyEngine.reduceToSingleDigit(currentMonth);
                    
        return NumerologyEngine.reduceToSingleDigit(sum);
    },

    /**
     * Calculates Daily Number
     */
    calculateDailyNumber: (personalYear: number, date: Date = new Date()): number => {
        const day = date.getDate();
        const month = date.getMonth() + 1;

        const sum = NumerologyEngine.reduceToSingleDigit(personalYear) + 
                    NumerologyEngine.reduceToSingleDigit(day) + 
                    NumerologyEngine.reduceToSingleDigit(month);
                    
        return NumerologyEngine.reduceToSingleDigit(sum);
    },

    /**
     * Reduces a number to a single digit 1–9 (for toolkit features e.g. phone number energy).
     * 11 → 2, 22 → 4, 33 → 6, 0 → 9.
     */
    reduceToSingleDigit: (num: number): number => {
        if (!Number.isFinite(num) || num < 0) return 0;
        let n = Math.floor(num);
        while (n > 9) {
            let sum = 0;
            while (n > 0) {
                sum += n % 10;
                n = Math.floor(n / 10);
            }
            n = sum;
        }
        return n === 0 ? 9 : n;
    },

    /**
     * Phone number energy: extract digits only, sum them, reduce to 1–9.
     */
    getPhoneNumberEnergy: (phoneString: string): number => {
        const digits = (phoneString || '').replace(/\D/g, '');
        if (digits.length === 0) return 0;
        const sum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
        return NumerologyEngine.reduceToSingleDigit(sum);
    },

    /**
     * Name/Brand destiny number: A–Z only (Pythagorean), sum, reduce to 1–9.
     * Ignores numbers, spaces, and special characters.
     */
    getNameDestinyNumber: (name: string): number => {
        const upper = (name || '').toUpperCase().replace(/[^A-Z]/g, '');
        if (upper.length === 0) return 0;
        let sum = 0;
        for (const char of upper) {
            const v = NumerologyEngine.letterMap[char];
            if (v !== undefined) sum += v;
        }
        return NumerologyEngine.reduceToSingleDigit(sum);
    },

    /**
     * Universal Day Energy: sum all digits of day, month, year; reduce to 1–9.
     * e.g. 25/12/2026 → 2+5+1+2+2+0+2+6 = 20 → 2.
     */
    getDateEnergy: (date: Date): number => {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        const digits = `${d}${m}${y}`.split('').map((c) => parseInt(c, 10));
        const sum = digits.reduce((acc, n) => acc + n, 0);
        return NumerologyEngine.reduceToSingleDigit(sum);
    },

    /**
     * Home/Real Estate energy: alphanumeric. Digits 0-9 add their value; letters A-Z use Pythagorean letterMap.
     * Strip spaces and symbols, then sum and reduce to 1-9. e.g. "12B" -> 1+2+2 = 5.
     */
    getHomeEnergy: (input: string): number => {
        const cleaned = (input || '').toUpperCase().replace(/[\s\W]/g, '');
        if (cleaned.length === 0) return 0;
        let sum = 0;
        for (const char of cleaned) {
            if (char >= '0' && char <= '9') {
                sum += parseInt(char, 10);
            } else if (char >= 'A' && char <= 'Z') {
                const v = NumerologyEngine.letterMap[char];
                if (v !== undefined) sum += v;
            }
        }
        return NumerologyEngine.reduceToSingleDigit(sum);
    },
};
