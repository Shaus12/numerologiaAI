import React, { createContext, useContext, useState, useEffect } from 'react';
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
            if (savedLang) {
                setLanguageState(savedLang as Language);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            setLanguageState(lang);
            await AsyncStorage.setItem('user_language', lang);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const t = (key: string) => {
        return translations[language][key] || translations['English'][key] || key;
    };

    const isRTL = language === 'Hebrew';
    const textDirection = isRTL ? 'right' : 'left';

    return (
        <SettingsContext.Provider value={{ language, setLanguage, t, isRTL, textDirection }}>
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
