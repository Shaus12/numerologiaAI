import { Alert } from 'react-native';
import { NumerologyEngine, getBirthdateLocalParts } from '../utils/numerology';

const SUPABASE_PROJECT_REF = 'cwnnjhcivkqnqgpmnitj';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bm5qaGNpdmtxbnFncG1uaXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzYxOTgsImV4cCI6MjA4NjA1MjE5OH0.h6uIZ75nrJGH7PopjA8uuhbKBRacj_5Jmk1ZP0Y46xg';
const EDGE_FUNCTION_URL = `https://${SUPABASE_PROJECT_REF}.functions.supabase.co/gemini-proxy`;
/** Edge function password: set via EXPO_PUBLIC_APP_SECRET only (never hardcode). Local: .env. Production: EAS Secrets. */
const APP_SECRET = process.env.EXPO_PUBLIC_APP_SECRET ?? '';

const handleError = (error: any) => {
    console.error('AI Service Error:', error);
    Alert.alert(
        "Cosmic Connection Weak",
        "The stars are misaligned. Please check your internet and try again."
    );
    throw error;
};

const callProxy = async (prompt: string) => {
    if (!APP_SECRET && __DEV__) {
        console.warn('[AI] EXPO_PUBLIC_APP_SECRET is not set. Add it to .env (see .env.example). Edge function will reject requests.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'X-App-Secret': APP_SECRET,
            },
            body: JSON.stringify({ prompt }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.error || `Network response was not ok (${response.status})`);
        }

        const dataResponse = await response.json();
        
        if (dataResponse.text === 'Error') {
            throw new Error(dataResponse.details || 'Unknown proxy error');
        }

        return dataResponse.text;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out after 15 seconds');
        }
        throw error;
    }
};

/** Optional personalization context for prompts (from onboarding) */
export type PersonalizationContext = {
    identity?: string;  // e.g. male, female, non-binary, private
    focus?: string;     // e.g. career, love, spiritual, health
    challenge?: string; // e.g. purpose, relationships, career, confidence, balance
};

export const AIService = {
    /**
     * Generates a mystical reading based on numerology data and onboarding context.
     */
    generateReading: async (data: {
        name: string;
        birthdate: string;
        lifePath: number | string;
        destiny: number | string;
        soulUrge: number | string;
        personality: number | string;
        language?: string;
        identity?: string;
        focus?: string;
        challenge?: string;
    }) => {
        try {
            const lang = data.language || 'English';
            const identity = data.identity || '';
            const focus = data.focus || '';
            const challenge = data.challenge || '';

            const prompt = `You are an expert mystical numerologist. Write a personalized numerology reading.

CORE DATA:
- Name: ${data.name}
- Birthdate: ${data.birthdate}
- Life Path Number: ${data.lifePath}
- Destiny Number: ${data.destiny}
- Soul Urge Number: ${data.soulUrge}
- Personality Number: ${data.personality}
${identity ? `- Gender/Identity: ${identity}` : ''}
${focus ? `- Main focus in life: ${focus}` : ''}
${challenge ? `- Current challenge: ${challenge}` : ''}

LANGUAGE & GENDER STRICT RULE:
- You MUST respond entirely in the language: ${lang}. Use English only if "${lang}" is not specified or as fallback.
- If the target language has gendered grammar (e.g. Hebrew, Spanish, French), you MUST conjugate all verbs, adjectives, and pronouns to match the user's gender/identity: "${identity || 'neutral/unknown'}". Do not use a default gender; use the one provided.

DEEP PERSONALIZATION:
- Do not simply list the user's focus or challenge. Weave them organically into the numerology interpretation.
- Explain how their Life Path, Destiny, Soul Urge, or Personality number gives them tools or strengths to overcome their specific challenge (${challenge || 'their current obstacles'}) and move toward their focus (${focus || 'their goals'}).
- Make the reading feel written for this person, not generic.

OUTPUT:
- Provide a short (2-3 paragraphs) mystical, inspiring reading. Keep the tone elegant, high-end, and profound.
- If the response language is Hebrew (or another RTL language), ensure punctuation renders correctly in RTL (e.g. question marks at the visual end of the sentence).`;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "The cosmic energies are currently shifting. Please try again in a moment."; // Fallback
        }
    },

    /**
     * Generates an oracle response for a specific question. Optional personalization for gendered language and context.
     */
    generateOracleResponse: async (
        question: string,
        lifePath: number | string,
        language: string = 'English',
        context?: PersonalizationContext
    ) => {
        try {
            const identity = context?.identity || '';
            const focus = context?.focus || '';
            const challenge = context?.challenge || '';

            const prompt = `You are the AI Oracle of Echoes: Numerology Map.
A seeker with Life Path ${lifePath} asks: "${question}"
${identity ? `Seeker's gender/identity (use for grammar in gendered languages): ${identity}.` : ''}
${focus || challenge ? `Additional context (weave into the answer where relevant): focus=${focus || '—'}, challenge=${challenge || '—'}.` : ''}

LANGUAGE & GENDER RULE: Respond entirely in the language: ${language}. If that language has gendered grammar (e.g. Hebrew, Spanish), conjugate all verbs, adjectives, and pronouns to match the seeker's identity: "${identity || 'neutral/unknown'}".

STYLE: Use simple, everyday words. Avoid complex or flowery language—be clear and easy to understand. Keep the answer short: 3–5 sentences maximum (about one short paragraph). Be mystical and insightful but brief and readable.
If the response language is Hebrew (or RTL), ensure punctuation is compatible with RTL rendering.`;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "The Oracle is silent. Seek again later.";
        }
    },

    /**
     * Calculates compatibility between two people. Optional context for gendered language and relationship nuance.
     */
    calculateCompatibility: async (
        userLifePath: number | string,
        partnerBirthdate: string,
        language: string = 'English',
        context?: PersonalizationContext
    ) => {
        try {
            const partnerLP = NumerologyEngine.calculateLifePath(partnerBirthdate);
            const identity = context?.identity || '';

            const prompt = `Analyze the numerological compatibility between two souls:
Person 1 Life Path: ${userLifePath}
Person 2 Life Path: ${partnerLP}

LANGUAGE & GENDER RULE: Respond entirely in the language: ${language}. If that language has gendered grammar, conjugate to match the user's identity: "${identity || 'neutral/unknown'}".

Provide a short, elegant analysis of their vibrational match and potential challenges.`;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "The stars are unclear about this match.";
        }
    },

    /**
     * Generates a compatibility reading for a saved connection (Vault). Used for caching; relationship type shapes the reading.
     */
    getConnectionCompatibility: async (
        userLifePath: number | string,
        connectionBirthdate: string,
        relationshipType: string,
        language: string = 'English',
        context?: PersonalizationContext
    ) => {
        try {
            const connectionLP = NumerologyEngine.calculateLifePath(connectionBirthdate);
            const identity = context?.identity || '';

            const prompt = `You are an expert mystical numerologist. Analyze the compatibility between two people and return ONLY a valid JSON object—no markdown, no code fences, no extra text.

INPUT:
- User (main person) Life Path Number: ${userLifePath}
- Connection Life Path Number: ${connectionLP}
- Relationship type: ${relationshipType}

LANGUAGE & GENDER: Write all string fields (title, strengths, challenges, summary) entirely in the language: ${language}. If that language has gendered grammar, conjugate to match the user's identity: "${identity || 'neutral/unknown'}". For Hebrew or RTL, ensure punctuation is RTL-compatible.

OUTPUT FORMAT: Return exactly one JSON object with these keys and types:
{
  "score": <number 1-100, overall compatibility>,
  "title": "<short catchy phrase describing the dynamic>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "challenges": ["<challenge 1>", "<challenge 2>", ...],
  "summary": "<2-3 sentence bottom-line summary of the connection and numerological advice>"
}

RULES:
- score: integer between 1 and 100.
- title: one short phrase (e.g. "Harmonious Growth", "Creative Sparks").
- strengths: array of 2-4 short strings; numerological strengths of this pairing.
- challenges: array of 2-4 short strings; potential friction or growth areas.
- summary: one paragraph, elegant and insightful, tailored to ${relationshipType}.
- Output ONLY the raw JSON object. No \`\`\`json or \`\`\` wrapper, no explanation.`;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return "The stars are unclear about this connection.";
        }
    },

    /**
     * Generates a Daily Action Guide as strict JSON based on the Personal Daily Number.
     * Personal Daily Number = (birthMonth + birthDay + today's day + today's month + today's year digits), reduced to 1–9.
     * Returns a string parsed as: { dailyNumber, theme, career, relationships, action }.
     */
    getDailyActionGuide: async (
        birthdate: string,             // ISO string or YYYY-MM-DD
        language: string = 'English',
        context?: Pick<PersonalizationContext, 'identity'>
    ) => {
        try {
            const identity = context?.identity || '';

            // Compute Personal Daily Number client-side so it's in the prompt (use local date only, no timezone shift)
            const { month: birthMonth, day: birthDay } = getBirthdateLocalParts(birthdate);
            const today = new Date();
            const todayDay = today.getDate();
            const todayMonth = today.getMonth() + 1;
            const todayYear = today.getFullYear();

            const reduceToSingleDigit = (n: number): number => {
                while (n > 9) n = String(n).split('').reduce((a, d) => a + parseInt(d, 10), 0);
                return n;
            };
            const birthPart = reduceToSingleDigit(birthMonth + birthDay);
            const todayPart = reduceToSingleDigit(todayDay + todayMonth + todayYear);
            const dailyNumber = reduceToSingleDigit(birthPart + todayPart);

            const prompt = `You are an expert mystical numerologist.

Today's Personal Daily Number for this seeker is: ${dailyNumber}

The number was calculated using Pythagorean numerology:
- Birth date contribution: birth month (${birthMonth}) + birth day (${birthDay}) = ${birthMonth + birthDay} → reduced to ${birthPart}
- Today's contribution: day (${todayDay}) + month (${todayMonth}) + year digits (${todayYear}) = ${todayDay + todayMonth + todayYear} → reduced to ${todayPart}
- Final: ${birthPart} + ${todayPart} = ${birthPart + todayPart} → Daily Number: ${dailyNumber}

Generate a Daily Action Guide for this seeker for today based on the energy of number ${dailyNumber}.

LANGUAGE: ${language}.
${identity ? `Grammar: use forms matching the seeker's identity (${identity}) if the language has gendered grammar.` : ''}

You MUST respond with ONLY a valid JSON object—no markdown, no code fences, no extra text.

OUTPUT FORMAT (exactly this structure):
{
  "dailyNumber": ${dailyNumber},
  "theme": "Short theme title for number ${dailyNumber} energy (3–6 words)",
  "career": "2–4 sentences of practical, grounded career and work advice for this energy.",
  "relationships": "2–4 sentences of relationship and social advice for this energy.",
  "action": "One concrete, specific action to take today (1–2 sentences)."
}

RULES:
- All string values must be in ${language}.
- Keep the tone mystical yet practical and empowering.
- Advice must feel personal and actionable, not generic.
- Output ONLY the raw JSON object. No \`\`\`json or explanation.`;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return null;
        }
    },

    /**
     * Generates a daily insight as strict JSON. Optional identity for gendered language.
     * Returns a string that must be parsed as: { cosmicMessage, energyScore, luckyHour, luckyColor }.
     */
    getDailyInsight: async (
        lifePath: number | string,
        language: string = 'English',
        context?: Pick<PersonalizationContext, 'identity' | 'focus'>
    ): Promise<string | null> => {
        try {
            const identity = context?.identity || '';
            const focus = context?.focus || '';
            const prompt = `You are a mystical numerologist. For a seeker with Life Path ${lifePath}, provide today's daily insight.

RESPONSE LANGUAGE: ${language}.
${identity ? `Use grammar that matches the seeker's identity (${identity}) if the language is gendered.` : ''}
${focus ? `FOCUS AREA: Tailor the message to this life focus: ${focus}.` : ''}

You MUST respond with ONLY a valid JSON object—no markdown, no code fences, no extra text.

OUTPUT FORMAT (exactly this structure):
{
  "cosmicMessage": "One powerful, short oracle sentence for today (1-2 sentences max).",
  "energyScore": <number from 1 to 100, representing today's cosmic energy level>,
  "luckyHour": "HH:mm in 24h format (e.g. 14:00 or 09:30)",
  "luckyColor": "A single color name or short phrase (e.g. Sapphire Blue or Gold)"
}

RULES:
- cosmicMessage: string, mystical and personalized to Life Path ${lifePath}.
- energyScore: integer between 1 and 100.
- luckyHour: string in 24h format like "14:00".
- luckyColor: string, one color or short descriptor.
- Output ONLY the raw JSON object. No \`\`\`json or explanation.`;

            return await callProxy(prompt);
        } catch (error) {
            handleError(error);
            return null;
        }
    }
};
