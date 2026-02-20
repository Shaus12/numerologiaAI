import { Alert } from 'react-native';
import { NumerologyEngine } from '../utils/numerology';

// TODO: Replace with your actual Supabase Project Reference
const SUPABASE_PROJECT_REF = 'cwnnjhcivkqnqgpmnitj';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bm5qaGNpdmtxbnFncG1uaXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzYxOTgsImV4cCI6MjA4NjA1MjE5OH0.h6uIZ75nrJGH7PopjA8uuhbKBRacj_5Jmk1ZP0Y46xg';
const EDGE_FUNCTION_URL = `https://${SUPABASE_PROJECT_REF}.functions.supabase.co/gemini-proxy`;

const handleError = (error: any) => {
    console.error('AI Service Error:', error);
    Alert.alert(
        "Cosmic Connection Weak",
        "The stars are misaligned. Please check your internet and try again."
    );
    throw error;
};

const callProxy = async (prompt: string) => {
    try {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'X-App-Secret': 'YOUR_INTERNAL_SECRET_KEY',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const dataResponse = await response.json();
        return dataResponse.text;
    } catch (error) {
        throw error;
    }
};

export const AIService = {
    /**
     * Generates a mystical reading based on numerology data
     */
    generateReading: async (data: {
        name: string;
        birthdate: string;
        lifePath: number | string;
        destiny: number | string;
        soulUrge: number | string;
        personality: number | string;
        language?: string;
    }) => {
        try {
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
        
         IMPORTANT: If the response language is Hebrew, ensure all sentences end with proper punctuation characters that render correctly in RTL (e.g. putting question marks at the visual end of the sentence).
      `;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "The cosmic energies are currently shifting. Please try again in a moment."; // Fallback
        }
    },

    /**
     * Generates an oracle response for a specific question
     */
    generateOracleResponse: async (question: string, lifePath: number | string, language: string = 'English') => {
        try {
            const prompt = `
                You are the AI Oracle of Numerologia. 
                A seeker with Life Path ${lifePath} asks: "${question}"
                
                Provide a mystical, deep, and insightful answer based on numerological wisdom.
                Keep it concise (1-2 paragraphs).
                RESPONSE LANGUAGE: ${language}
                IMPORTANT: If the response language is Hebrew, ensure all punctuation is compatible with RTL rendering.
            `;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "The Oracle is silent. Seek again later.";
        }
    },

    /**
     * Calculates compatibility between two people
     */
    calculateCompatibility: async (userLifePath: number | string, partnerBirthdate: string, language: string = 'English') => {
        try {
            const partnerLP = NumerologyEngine.calculateLifePath(partnerBirthdate);

            const prompt = `
                Analyze the numerological compatibility between two souls:
                Person 1 Life Path: ${userLifePath}
                Person 2 Life Path: ${partnerLP}
                
                Provide a short, elegant analysis of their vibrational match and potential challenges.
                RESPONSE LANGUAGE: ${language}
            `;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "The stars are unclear about this match.";
        }
    },

    /**
     * Generates a daily insight
     */
    getDailyInsight: async (lifePath: number | string, language: string = 'English') => {
        try {
            const prompt = `Provide a single, powerful oracle insight for someone with Life Path ${lifePath} for today. One sentence max. RESPONSE LANGUAGE: ${language}`;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "Trust your intuition today.";
        }
    }
};
