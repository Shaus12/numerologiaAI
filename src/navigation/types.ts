export type RootStackParamList = {
    Splash: undefined;
    Settings: undefined;
    Paywall: { variant?: 'onboarding' };
    Welcome: undefined;
    OnboardingFlow: undefined;
    Language: undefined;
    Name: undefined;
    Identity: undefined;
    Birthdate: undefined;
    Focus: undefined;
    Challenge: undefined;
    AIConsent: { userData: any };
    LoadingAnalysis: undefined;
    Analysis: undefined;
    Calculating: { userData: any };
    AnalysisComplete: {
        reading: string;
        lifePath: number | string;
        destiny: number | string;
        soulUrge: number | string;
        personality: number | string;
        language: string;
        personalYear: number | string;
        dailyNumber: number | string;
    };
    MainTabs: {
        reading: string;
        lifePath: number | string;
        destiny: number | string;
        soulUrge: number | string;
        personality: number | string;
        language: string;
        personalYear: number | string;
        dailyNumber: number | string;
    };
    ConnectionReading: { connectionId: string };
    PhoneNumberEnergy: undefined;
    NameEnergy: undefined;
    DateEnergy: undefined;
    HomeEnergy: undefined;
    PrivacyPolicy: undefined;
    TermsOfUse: undefined;
};

export type MainTabParamList = {
    Vault: undefined;
    Home: {
        name: string;
        reading: string;
        lifePath: number | string;
        destiny: number | string;
        soulUrge: number | string;
        personality: number | string;
        language: string;
        personalYear: number | string;
        dailyNumber: number | string;
    };
    Oracle: {
        lifePath: number | string;
        language: string;
    };
    Forecast: undefined;
    Profile: {
        name: string;
        reading: string;
        lifePath: number | string;
        destiny: number | string;
        soulUrge: number | string;
        personality: number | string;
        language: string;
        personalYear: number | string;
        dailyNumber: number | string;
    };
};
