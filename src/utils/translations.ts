export type Language = 'English' | 'Spanish' | 'Portuguese' | 'French' | 'German' | 'Hebrew';

export const translations: Record<Language, Record<string, string>> = {
    English: {
        // Global
        loading: "Loading...",

        // HomeScreen
        dailyInsight: "Your cosmic journey awaits...",
        consultingStars: "Consulting the stars...",
        welcomeBack: "Welcome back,",
        seeker: "Seeker",
        cosmicMessage: "Cosmic Message for Today",
        yourNumbers: "YOUR NUMBERS",
        personalYear: "Personal Year",
        yearTransformation: "Year of transformation",
        dailyNumber: "Daily Number",
        energyToday: "Energy today",
        destiny: "Destiny",
        soulPurpose: "Soul purpose",
        numerologyMap: "YOUR NUMEROLOGY MAP",
        core: "Core",
        lifePath: "Life Path",
        soulUrge: "Soul Urge",
        personality: "Personality",
        birthday: "Birthday",
        askOracle: "Ask the Oracle",
        oracleSub: "Get personalized answers to your destiny",

        // OracleScreen
        oracleGreeting: "Greetings, seeker. I am the Oracle. What wisdom do you seek today?",
        oracleChanneling: "The Oracle is channeling...",
        presetAnalysis: "Full analysis",
        presetLove: "Love life",
        presetCareer: "Career path",
        inputPlaceholder: "Ask your question...",

        // MatchScreen
        soulMatch: "Soul Match",
        alignVibrations: "Align your vibrations with another soul",
        enterPartnerDate: "ENTER PARTNER'S BIRTHDATE",
        commenceAlignment: "Commence Alignment",
        scanningVibrations: "Scanning Vibrations...",
        readingThreads: "Reading the numerical threads that bind you",
        theVerdict: "The Verdict",
        newAnalysis: "New Analysis",

        // ProfileScreen
        premiumMember: "Premium Member",
        upgradePro: "Upgrade to Pro",
        manageSubscription: "Manage Subscription",
        settings: "Settings",
        language: "Language",
        dailyFocus: "Daily Focus",
        vibration: "Vibration",
        coreNumbers: "YOUR CORE NUMBERS",
        permissionNeeded: "Permission needed",
        galleryAccess: "We need access to your gallery to upload a profile picture.",

        // SettingsScreen
        settingsTitle: "Settings",
        languageTitle: "Language",

        // Legal
        disclaimer: "This app is for entertainment purposes only. Numerical analysis and AI insights do not constitute professional, financial, or medical advice.",
        privacyPolicy: "Privacy Policy",
        dailyReminders: "Daily Reminders",
        enableNotificationsSettings: "Please enable notifications in your phone settings to receive daily insights.",
    },
    Hebrew: {
        // Global
        loading: "טוען...",

        // HomeScreen
        dailyInsight: "המסע הקוסמי שלך מחכה...",
        consultingStars: "מתייעץ עם הכוכבים...",
        welcomeBack: "ברוך שובך,",
        seeker: "מחפש",
        cosmicMessage: "מסר קוסמי להיום",
        yourNumbers: "המספרים שלך",
        personalYear: "שנה אישית",
        yearTransformation: "שנת שינוי",
        dailyNumber: "מספר יומי",
        energyToday: "אנרגיה להיום",
        destiny: "גורל",
        soulPurpose: "ייעוד הנשמה",
        numerologyMap: "המפה הנומרולוגית שלך",
        core: "ליבה",
        lifePath: "שביל חיים",
        soulUrge: "דחף הנשמה",
        personality: "אישיות",
        birthday: "יום הולדת",
        askOracle: "שאל את האורקל",
        oracleSub: "קבל תשובות אישיות לגורלך",

        // OracleScreen
        oracleGreeting: "שלום, מחפש. אני האורקל. איזו חוכמה אתה מחפש היום?",
        oracleChanneling: "האורקל מתקשר...",
        presetAnalysis: "ניתוח מלא",
        presetLove: "חיי אהבה",
        presetCareer: "קריירה",
        inputPlaceholder: "שאל את שאלתך...",

        // MatchScreen
        soulMatch: "התאמה נשמתית",
        alignVibrations: "סנכרן את התדרים שלך עם נשמה אחרת",
        enterPartnerDate: "הכנס תאריך לידה של בן/בת הזוג",
        commenceAlignment: "התחל סנכרון",
        scanningVibrations: "סורק תדרים...",
        readingThreads: "קורא את החוטים הנומרולוגיים הקושרים ביניכם",
        theVerdict: "פסק הדין",
        newAnalysis: "ניתוח חדש",

        // ProfileScreen
        premiumMember: "חבר פרימיום",
        upgradePro: "שדרג לפרו",
        manageSubscription: "ניהול מנוי",
        settings: "הגדרות",
        language: "שפה",
        dailyFocus: "מיקוד יומי",
        vibration: "תדר",
        coreNumbers: "מספרי הליבה שלך",
        permissionNeeded: "נדרשת הרשאה",
        galleryAccess: "אנו זקוקים לגישה לגלריה כדי להעלות תמונת פרופיל.",

        // SettingsScreen
        settingsTitle: "הגדרות",
        languageTitle: "שפה",

        // Legal
        disclaimer: "אפליקציה זו נועדה למטרות בידור בלבד. ניתוח נומרולוגי ותובנות AI אינם מהווים ייעוץ מקצועי, פיננסי או רפואי.",
        privacyPolicy: "מדיניות פרטיות",
        dailyReminders: "תזכורות יומיות",
        enableNotificationsSettings: "אנא אפשר התראות בהגדרות הטלפון כדי לקבל תובנות יומיות.",
    },
    // Fallback for others to English for now, can be expanded later
    Spanish: {},
    Portuguese: {},
    French: {},
    German: {},
};

// Fill other languages with English as fallback for now
['Spanish', 'Portuguese', 'French', 'German'].forEach(lang => {
    translations[lang as Language] = { ...translations.English };
});
