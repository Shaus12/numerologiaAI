import { GoogleGenerativeAI } from '@google/generative-ai';
import { NumerologyEngine } from '../utils/numerology';

const API_KEY = 'AIzaSyAvxUKMG_0NRu2u1ypBlWcGBApwqm7OD_c';
const genAI = new GoogleGenerativeAI(API_KEY);

export const AIService = {
    /**
     * Generates a mystical reading based on numerology data
     */
    generateReading: async (data: {
        name: string;
        birthdate: string;
        lifePath: number;
        destiny: number;
        soulUrge: number;
        personality: number;
        language?: string;
    }) => {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const lang = data.language || 'English';

            const prompt = `
        You are an expert mystical numerologist. Based on the following data:
        - Name: ${data.name}
        - Birthdate: ${data.birthdate}
        - Life Path Number: ${data.lifePath}
        - Destiny Number: ${data.destiny}
        - Soul Urge Number: ${data.soulUrge}
        - Personality Number: ${data.personality}

        Provide a short (2-3 paragraphs) mystical, inspiring reading that explains the core essence of this person according to these numbers.
        Keep the tone elegant, high-end, and profound.
        RESPONSE LANGUAGE: ${lang}
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating reading:', error);
            return "The cosmic energies are currently shifting. Please try again in a moment.";
        }
    },

    /**
     * Generates an oracle response for a specific question
     */
    generateOracleResponse: async (question: string, lifePath: number, language: string = 'English') => {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `
                You are the AI Oracle of Numerologia. 
                A seeker with Life Path ${lifePath} asks: "${question}"
                
                Provide a mystical, deep, and insightful answer based on numerological wisdom.
                Keep it concise (1-2 paragraphs).
                RESPONSE LANGUAGE: ${language}
            `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            return "The Oracle is silent. Seek again later.";
        }
    },

    /**
     * Calculates compatibility between two people
     */
    calculateCompatibility: async (userLifePath: number, partnerBirthdate: string, language: string = 'English') => {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const partnerLP = NumerologyEngine.calculateLifePath(partnerBirthdate);

            const prompt = `
                Analyze the numerological compatibility between two souls:
                Person 1 Life Path: ${userLifePath}
                Person 2 Life Path: ${partnerLP}
                
                Provide a short, elegant analysis of their vibrational match and potential challenges.
                RESPONSE LANGUAGE: ${language}
            `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            return "The stars are unclear about this match.";
        }
    },

    /**
     * Generates a daily insight
     */
    getDailyInsight: async (lifePath: number, language: string = 'English') => {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `Provide a single, powerful oracle insight for someone with Life Path ${lifePath} for today. One sentence max. RESPONSE LANGUAGE: ${language}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            return "Trust your intuition today.";
        }
    }
};
