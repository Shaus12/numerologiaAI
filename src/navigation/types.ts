export type RootStackParamList = {
    Splash: undefined;
    Settings: undefined;
    Paywall: undefined;
    Welcome: undefined;
    Language: undefined;
    Identity: undefined;
    Name: undefined;
    Birthdate: undefined;
    AIConsent: { userData: any };
    Calculating: { userData: any };
    BirthTime: undefined;
    EnterBirthTime: undefined;
    Relationship: undefined;
    Focus: undefined;
    Challenge: undefined;
    Expectations: undefined;
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
    Map: undefined;
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
