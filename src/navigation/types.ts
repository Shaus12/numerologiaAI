export type RootStackParamList = {
    Splash: undefined;
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
        lifePath: number;
        destiny: number;
        soulUrge: number;
        personality: number;
        language: string;
        personalYear: number;
        dailyNumber: number;
    };
    MainTabs: {
        reading: string;
        lifePath: number;
        destiny: number;
        soulUrge: number;
        personality: number;
        language: string;
        personalYear: number;
        dailyNumber: number;
    };
};

export type MainTabParamList = {
    Home: {
        name: string;
        reading: string;
        lifePath: number;
        destiny: number;
        soulUrge: number;
        personality: number;
        language: string;
        personalYear: number;
        dailyNumber: number;
    };
    Oracle: {
        lifePath: number;
        language: string;
    };
    Match: {
        lifePath: number;
        language: string;
    };
    Profile: {
        name: string;
        reading: string;
        lifePath: number;
        destiny: number;
        soulUrge: number;
        personality: number;
        language: string;
        personalYear: number;
        dailyNumber: number;
    };
};
