export type Language = 'English' | 'Spanish' | 'Portuguese' | 'French' | 'German' | 'Hebrew';

export const translations: Record<Language, Record<string, string>> = {
    English: {
        // Global
        loading: "Loading...",
        continue: "Continue",

        // Onboarding - Language
        chooseYour: "Choose your ",
        languageWord: "language",
        languageSubtitle: "Select your preferred language for a personalized experience.",

        // Onboarding - Welcome
        startYourJourney: "Start Your Journey",
        discoverTitle: "Discover what the ",
        discoverTitleAccent: "numbers",
        discoverTitleEnd: " say about your destiny.",
        discoverSubtitle: "Unlock your cosmic blueprint with AI-powered numerology analysis.",
        poweredBy: "POWERED BY ADVANCED AI",

        // Onboarding - Identity
        identityTitle: "How do you ",
        identityTitleAccent: "identify?",
        identitySubtitle: "This helps us personalize your numerology readings",
        male: "Male",
        female: "Female",
        nonBinary: "Non-binary",
        preferNotToSay: "Prefer not to say",

        // Onboarding - Header
        stepLabel: "STEP",
        ofLabel: "OF",

        // Onboarding - Name
        nameTitleLine1: "What is your",
        nameTitleLine2: "full name?",
        nameSubtitle: "Your name holds the key to your destiny in the Pythagorean system.",
        namePlaceholder: "Enter your full name",

        // Onboarding - Birthdate
        birthdateTitleLine1: "When were you",
        birthdateTitleLine2: "born?",
        birthdateSubtitle: "Your date of birth reveals your Life Path and inner character.",

        // Onboarding - Birth time
        birthTimeTitleLine1: "Do you know your",
        birthTimeTitleLine2: "birth time?",
        birthTimeSubtitle: "Your exact birth time unlocks deeper astrological insights.",
        birthTimeYes: "Yes, I know it",
        birthTimeYesSub: "I will enter my birth time",
        birthTimeNo: "No, I do not know",
        birthTimeNoSub: "Skip this step",
        enterBirthTimeTitle: "Enter your birth time",
        enterBirthTimeSubtitle: "This helps unlock deeper astrological insights.",

        // Onboarding - Relationship
        relationshipTitleLine1: "What is your",
        relationshipTitleLine2: "relationship status?",
        relationshipSubtitle: "Understanding your love life helps us provide better compatibility insights.",
        statusSingle: "Single",
        statusSingleSub: "Open to finding love",
        statusRelationship: "In a Relationship",
        statusRelationshipSub: "Dating or committed",
        statusMarried: "Married",
        statusMarriedSub: "Legally or spiritually united",
        statusComplicated: "It's Complicated",
        statusComplicatedSub: "Navigating complex dynamics",
        statusPrivate: "Prefer not to say",
        statusPrivateSub: "Keep this private",

        // Onboarding - Focus
        focusTitleLine1: "What is your",
        focusTitleLine2: "main focus",
        focusTitleLine3: "right now?",
        focusSubtitle: "Select one to personalize your journey.",
        focusCareer: "Career & Money",
        focusCareerSub: "Focus on professional growth and financial stability",
        focusLove: "Love & Relationships",
        focusLoveSub: "Focus on finding or nurturing deep connections",
        focusSpiritual: "Spiritual Growth",
        focusSpiritualSub: "Focus on inner peace, mindfulness, and purpose",
        focusHealth: "Health",
        focusHealthSub: "Focus on physical well-being and vital energy",
        focusFooterNote: "You can change your focus anytime in settings.",

        // Onboarding - Challenge
        challengeTitleLine1: "What is your",
        challengeTitleLine2: "biggest challenge?",
        challengeSubtitle: "We will focus your readings on overcoming this obstacle.",
        challengePurpose: "Finding My Purpose",
        challengePurposeSub: "Discovering my true calling in life",
        challengeRelationships: "Improving Relationships",
        challengeRelationshipsSub: "Building deeper connections",
        challengeCareer: "Career Growth",
        challengeCareerSub: "Advancing professionally",
        challengeConfidence: "Self-Confidence",
        challengeConfidenceSub: "Believing in myself more",
        challengeBalance: "Life Balance",
        challengeBalanceSub: "Harmonizing work and personal life",

        // Onboarding - Expectations
        expectationsTitleLine1: "What do you expect",
        expectationsTitleLine2: "from",
        expectationsTitleLine3: "Numerologia AI?",
        expectationsSubtitle: "Select all that apply — we will tailor your experience",
        expectGuidance: "Daily Guidance",
        expectGuidanceSub: "Start each day with cosmic insights",
        expectKnowledge: "Deep Self-Knowledge",
        expectKnowledgeSub: "Understand your true nature",
        expectCompatibility: "Compatibility Analysis",
        expectCompatibilitySub: "Find your ideal matches",
        expectPredictions: "Future Predictions",
        expectPredictionsSub: "Glimpse what lies ahead",
        expectationsFooterNote: "Select at least one option",

        // Onboarding - Calculating
        calculatingTitle: "Calculating...",
        calcStep1: "Aligning planetary energies...",
        calcStep2: "Decoding your Life Path...",
        calcStep3: "Extracting Soul Urge...",
        calcStep4: "Consulting the Oracle...",
        calcStep5: "Finalizing your blueprint...",

        // Tab bar
        tabHome: "Home",
        tabOracle: "Oracle",
        tabMatch: "Match",
        tabProfile: "Profile",
        tabVault: "Vault",

        // Vault
        vaultTitle: "Saved Connections",
        vaultSubtitle: "Save people and view compatibility",
        addConnection: "Add connection",
        connectionName: "Name",
        connectionBirthdate: "Birthdate",
        relationshipType: "Relationship type",
        relationshipRomantic: "Romantic",
        relationshipColleague: "Colleague",
        relationshipFamily: "Family",
        relationshipFriend: "Friend",
        saveConnection: "Save",
        vaultPaywallMessage: "Upgrade to Pro to save unlimited connections",
        connectionReadingTitle: "Compatibility Reading",
        generatingReading: "Generating reading...",
        vaultReadingSaved: "Reading saved",
        strengthsLabel: "Strengths",
        challengesLabel: "Challenges",
        bottomLineLabel: "Bottom Line",
        compatibilityScore: "Compatibility",

        // HomeScreen
        dailyInsight: "Your cosmic journey awaits...",
        consultingStars: "Consulting the stars...",
        welcomeBack: "Welcome back!",
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

        // AnalysisCompleteScreen
        analysisComplete: "Analysis Complete",
        blueprintReady: "Your cosmic blueprint is ready",
        unlockFullProExperience: "Unlock the Full Pro Experience",
        proDescription: "Unlock daily transits, advanced compatibility, and personalized AI oracle insights.",
        viewDashboard: "View Dashboard",
        shareResult: "Share Result",
        unlockFullAnalysis: "Start your 3-day free trial to unlock the full analysis",
        startFreeTrial: "Start 3-Day Free Trial",
        startTrialReadFullSummary: "Start Trial to Read Full Summary",
        teaserFadeLabel: "Continue reading with free Trial",
        unlockFreeTrial3Days: "Unlock Free Trial for 3 Days",
        trialSubtext: "3-day free trial • No credit card",
        viewFullAnalysis: "View your full analysis",
        viewFullAnalysisSub: "Re-read your complete numerology reading",

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
        englishLanguage: "English",
        hebrewLanguage: "Hebrew",
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
        privacyPolicyMessage: "Privacy policy link placeholder.",
        dailyReminders: "Daily Reminders",
        enableNotificationsSettings: "Please enable notifications in your phone settings to receive daily insights.",
        deleteAccount: "Delete Account",
        deleteConfirm: "Are you sure you want to delete your account? This action cannot be undone.",
        cancel: "Cancel",
        delete: "Delete",
        recentQuestions: "Recent Questions",
        noHistory: "The mists of time are clear...",
    },
    Hebrew: {
        // Global
        loading: "טוען...",
        continue: "המשך",

        // Onboarding - Language
        chooseYour: "בחר את ",
        languageWord: "שפה",
        languageSubtitle: "בחר את שפת ההעדפה שלך לחוויית שימוש מותאמת.",

        // Onboarding - Welcome
        startYourJourney: "התחל את המסע",
        discoverTitle: "גלה מה ",
        discoverTitleAccent: "המספרים",
        discoverTitleEnd: " אומרים על הגורל שלך.",
        discoverSubtitle: "גלה את המפה הקוסמית שלך עם ניתוח נומרולוגיה מבוסס AI.",
        poweredBy: "מופעל על ידי AI מתקדם",

        // Onboarding - Identity
        identityTitle: "איך אתה ",
        identityTitleAccent: "מזהה את עצמך?",
        identitySubtitle: "זה עוזר לנו להתאים אישית את קריאות הנומרולוגיה שלך",
        male: "גבר",
        female: "אישה",
        nonBinary: "לא בינארי",
        preferNotToSay: "מעדיף/ה לא לומר",

        // Onboarding - Header
        stepLabel: "שלב",
        ofLabel: "מתוך",

        // Onboarding - Name
        nameTitleLine1: "מה השם",
        nameTitleLine2: "המלא שלך?",
        nameSubtitle: "שמך מחזיק את המפתח לגורל שלך במערכת הנומרולוגית.",
        namePlaceholder: "הזן את שמך המלא",

        // Onboarding - Birthdate
        birthdateTitleLine1: "מתי",
        birthdateTitleLine2: "נולדת?",
        birthdateSubtitle: "תאריך הלידה שלך מגלה את שביל החיים והאופי הפנימי שלך.",

        // Onboarding - Birth time
        birthTimeTitleLine1: "האם את/ה יודע/ת",
        birthTimeTitleLine2: "את שעת הלידה?",
        birthTimeSubtitle: "שעת הלידה המדויקת פותחת תובנות אסטרולוגיות עמוקות יותר.",
        birthTimeYes: "כן, אני יודע/ת",
        birthTimeYesSub: "אזין את שעת הלידה שלי",
        birthTimeNo: "לא, אני לא יודע/ת",
        birthTimeNoSub: "דלג על שלב זה",
        enterBirthTimeTitle: "הזן את שעת הלידה שלך",
        enterBirthTimeSubtitle: "זה עוזר לפתוח תובנות אסטרולוגיות עמוקות יותר.",

        // Onboarding - Relationship
        relationshipTitleLine1: "מה הסטטוס",
        relationshipTitleLine2: "הזוגי שלך?",
        relationshipSubtitle: "הבנת חיי האהבה שלך עוזרת לנו לתת תובנות תאימות טובות יותר.",
        statusSingle: "רווק/ה",
        statusSingleSub: "פתוח/ה לאהבה",
        statusRelationship: "במערכת יחסים",
        statusRelationshipSub: "יוצא/ת או במחויבות",
        statusMarried: "נשוי/אה",
        statusMarriedSub: "מאוחד/ת בחוק או ברוח",
        statusComplicated: "זה מסובך",
        statusComplicatedSub: "מנווט/ת דינמיקות מורכבות",
        statusPrivate: "מעדיף/ה לא לומר",
        statusPrivateSub: "לשמור פרטי",

        // Onboarding - Focus
        focusTitleLine1: "מה המיקוד",
        focusTitleLine2: "העיקרי שלך",
        focusTitleLine3: "כרגע?",
        focusSubtitle: "בחר/י אחד כדי להתאים אישית את המסע שלך.",
        focusCareer: "קריירה וכסף",
        focusCareerSub: "מיקוד בצמיחה מקצועית ויציבות פיננסית",
        focusLove: "אהבה ויחסים",
        focusLoveSub: "מיקוד במציאת או טיפוח קשרים עמוקים",
        focusSpiritual: "צמיחה רוחנית",
        focusSpiritualSub: "מיקוד בשלום פנימי, מיינדפולנס וייעוד",
        focusHealth: "בריאות",
        focusHealthSub: "מיקוד ברווחה גופנית ואנרגיה חיונית",
        focusFooterNote: "ניתן לשנות את המיקוד בכל עת בהגדרות.",

        // Onboarding - Challenge
        challengeTitleLine1: "מה האתגר",
        challengeTitleLine2: "הגדול ביותר שלך?",
        challengeSubtitle: "נתמקד את הקריאות שלך בהתגברות על מכשול זה.",
        challengePurpose: "מציאת הייעוד שלי",
        challengePurposeSub: "גילוי הייעוד האמיתי שלי בחיים",
        challengeRelationships: "שיפור יחסים",
        challengeRelationshipsSub: "בניית קשרים עמוקים יותר",
        challengeCareer: "צמיחה בקריירה",
        challengeCareerSub: "התקדמות מקצועית",
        challengeConfidence: "ביטחון עצמי",
        challengeConfidenceSub: "להאמין בעצמי יותר",
        challengeBalance: "איזון בחיים",
        challengeBalanceSub: "הרמוניה בין עבודה לחיים אישיים",

        // Onboarding - Expectations
        expectationsTitleLine1: "מה את/ה מצפה/ה",
        expectationsTitleLine2: "מ",
        expectationsTitleLine3: "Numerologia AI?",
        expectationsSubtitle: "בחר/י את כל מה שמתאים — נתאים את החוויה שלך",
        expectGuidance: "הנחיה יומית",
        expectGuidanceSub: "התחל/י כל יום בתובנות קוסמיות",
        expectKnowledge: "הכרה עצמית עמוקה",
        expectKnowledgeSub: "להבין את הטבע האמיתי שלך",
        expectCompatibility: "ניתוח תאימות",
        expectCompatibilitySub: "מצא/י את ההתאמות האידיאליות שלך",
        expectPredictions: "תחזיות עתיד",
        expectPredictionsSub: "הצצה למה שמחכה לך",
        expectationsFooterNote: "בחר/י לפחות אפשרות אחת",

        // Onboarding - Calculating
        calculatingTitle: "מחשב...",
        calcStep1: "מיישר אנרגיות פלנטריות...",
        calcStep2: "מפענח את שביל החיים שלך...",
        calcStep3: "מחלץ את דחף הנשמה...",
        calcStep4: "מתייעץ עם האורקל...",
        calcStep5: "משלים את המפה שלך...",

        // Tab bar
        tabHome: "בית",
        tabOracle: "אורקל",
        tabMatch: "התאמה",
        tabProfile: "פרופיל",
        tabVault: "כספת",

        // Vault
        vaultTitle: "קשרים שמורים",
        vaultSubtitle: "שמור אנשים וצפה בתאימות",
        addConnection: "הוסף קשר",
        connectionName: "שם",
        connectionBirthdate: "תאריך לידה",
        relationshipType: "סוג קשר",
        relationshipRomantic: "רומנטי",
        relationshipColleague: "עמית",
        relationshipFamily: "משפחה",
        relationshipFriend: "חבר/ה",
        saveConnection: "שמור",
        vaultPaywallMessage: "שדרג לפרו כדי לשמור קשרים ללא הגבלה",
        connectionReadingTitle: "קריאת תאימות",
        generatingReading: "מייצר קריאה...",
        vaultReadingSaved: "קריאה שמורה",
        strengthsLabel: "חוזקות",
        challengesLabel: "אתגרים",
        bottomLineLabel: "שורה תחתונה",
        compatibilityScore: "תאימות",

        // HomeScreen
        dailyInsight: "המסע הקוסמי שלך מחכה...",
        consultingStars: "מתייעץ עם הכוכבים...",
        welcomeBack: "ברוך שובך!",
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

        // AnalysisCompleteScreen
        analysisComplete: "הניתוח הושלם",
        blueprintReady: "התוכנית הקוסמית שלך מוכנה",
        unlockFullProExperience: "פתח את חוויית הפרו המלאה",
        proDescription: "פתח מעברים יומיים, תאימות מתקדמת ותובנות אורקל AI מותאמות אישית.",
        viewDashboard: "צפה בלוח הבקרה",
        shareResult: "שתף תוצאה",
        unlockFullAnalysis: "התחל ניסיון חינם של 3 ימים כדי לפתוח את הניתוח המלא",
        startFreeTrial: "התחל ניסיון חינם 3 ימים",
        startTrialReadFullSummary: "התחל ניסיון כדי לקרוא את הסיכום המלא",
        teaserFadeLabel: "המשך קריאה עם Trial חינם",
        unlockFreeTrial3Days: "שחרר עם Trial חינם ל-3 ימים",
        trialSubtext: "ניסיון חינם 3 ימים • ללא כרטיס אשראי",
        viewFullAnalysis: "צפה בניתוח המלא שלך",
        viewFullAnalysisSub: "קרא שוב את קריאת הנומרולוגיה המלאה שלך",

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
        englishLanguage: "אנגלית",
        hebrewLanguage: "עברית",
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
        privacyPolicyMessage: "מקום להצבת קישור למדיניות פרטיות.",
        dailyReminders: "תזכורות יומיות",
        enableNotificationsSettings: "אנא אפשר התראות בהגדרות הטלפון כדי לקבל תובנות יומיות.",
        deleteAccount: "מחיקת חשבון",
        deleteConfirm: "האם אתה בטוח שברצונך למחוק את חשבונך? לא ניתן לבטל פעולה זו.",
        cancel: "ביטול",
        delete: "מחק",
        recentQuestions: "שאלות אחרונות",
        noHistory: "ערפילי הזמן צלולים...",
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

/** BCP 47 locale for date/number formatting (e.g. toLocaleDateString) */
export const localeForLanguage: Record<Language, string> = {
    English: 'en-US',
    Hebrew: 'he-IL',
    Spanish: 'es',
    Portuguese: 'pt',
    French: 'fr',
    German: 'de',
};
