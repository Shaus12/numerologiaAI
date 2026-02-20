export type RootStackParamList = {
    Splash: undefined;
    Settings: undefined;
    Paywall: undefined;
    Welcome: undefined;
    Language: undefined;
    Identity: undefined;
    Name: undefined;
    Birthdate: undefined;
    Calculating: undefined;
    BirthTime: undefined;
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
};

export type MainTabParamList = {
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
    Match: {
        lifePath: number | string;
        language: string;
    };
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
