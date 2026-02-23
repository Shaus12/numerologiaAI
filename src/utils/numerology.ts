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

export const NumerologyEngine = {
    /**
     * Calculates the Life Path Number (Sum of all digits in birthdate)
     */
    calculateLifePath: (birthdate: string | Date): number => {
        const date = new Date(birthdate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

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
        const date = new Date(birthdate);
        const day = date.getDate();
        const month = date.getMonth() + 1;

        const reduce = (num: number): number => {
            if (num <= 9 || num === 11 || num === 22 || num === 33) return num;
            return reduce(String(num).split('').reduce((acc, d) => acc + parseInt(d), 0));
        };

        const sum = reduce(day) + reduce(month) + reduce(String(currentYear).split('').reduce((acc, d) => acc + parseInt(d), 0));
        return reduce(sum);
    },

    /**
     * Calculates Daily Number
     */
    calculateDailyNumber: (personalYear: number, date: Date = new Date()): number => {
        const day = date.getDate();
        const month = date.getMonth() + 1;

        const reduce = (num: number): number => {
            if (num <= 9 || num === 11 || num === 22 || num === 33) return num;
            return reduce(String(num).split('').reduce((acc, d) => acc + parseInt(d), 0));
        };

        const sum = reduce(personalYear) + reduce(day) + reduce(month);
        return reduce(sum);
    },
};
