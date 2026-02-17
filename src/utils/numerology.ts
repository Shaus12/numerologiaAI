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

            // Master numbers (11, 22, 33) are usually kept, but for simplicity we reduce to single digit
            // or we can handle them. Let's reduce but keep Master numbers.
            if (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
                return sumDigits(sum);
            }
            return sum;
        };

        const finalSum = sumDigits(sumDigits(day) + sumDigits(month) + sumDigits(year));
        return finalSum;
    },

    /**
     * Pythagorean mapping for letters
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
     * Calculates specific aspect (Destiny, Soul Urge, etc.)
     */
    calculateNameNumber: (name: string, type: 'all' | 'vowels' | 'consonants'): number => {
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');

        let sum = 0;
        for (let char of cleanName) {
            const isVowel = vowels.includes(char);
            if (type === 'all' || (type === 'vowels' && isVowel) || (type === 'consonants' && !isVowel)) {
                sum += NumerologyEngine.letterMap[char] || 0;
            }
        }

        const reduce = (num: number): number => {
            if (num <= 9 || num === 11 || num === 22 || num === 33) return num;
            return reduce(String(num).split('').reduce((acc, d) => acc + parseInt(d), 0));
        };

        return reduce(sum);
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
