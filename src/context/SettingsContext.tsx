import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { translations, Language } from '../utils/translations';

interface SettingsContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
    textDirection: 'left' | 'right';
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('English');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedLang = await AsyncStorage.getItem('user_language');
            // Strict check: only update if the saved language exists in our translations
            if (savedLang && translations[savedLang as Language]) {
                setLanguageState(savedLang as Language);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const setLanguage = useCallback(async (lang: Language) => {
        try {
            if (translations[lang]) {
                setLanguageState(lang);
                await AsyncStorage.setItem('user_language', lang);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }, []);

    const t = useCallback((key: string) => {
        const currentTranslation = translations[language] || translations['English'];
        if (!currentTranslation) return key;
        return currentTranslation[key] || translations['English'][key] || key;
    }, [language]);

    const isRTL = useMemo(() => language === 'Hebrew', [language]);
    const textDirection = useMemo(() => (isRTL ? 'right' : 'left') as 'left' | 'right', [isRTL]);

    const contextValue = useMemo(() => ({
        language,
        setLanguage,
        t,
        isRTL,
        textDirection
    }), [language, setLanguage, t, isRTL, textDirection]);

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
