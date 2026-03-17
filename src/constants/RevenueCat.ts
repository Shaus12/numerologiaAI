/** Use platform-specific keys from RevenueCat dashboard (Project Settings > API keys). */
export const RevenueCatConfig = {
    /** Production iOS public SDK key (appl_...) */
    iosApiKey: 'appl_SmJjaqyZNvkmVqedErwWHwQNnBI',
    /**
     * Production Android public SDK key (goog_...).
     * Get it from: RevenueCat dashboard → Project Settings → API keys → Android.
     * Until this is set, getOfferings() will fail on Android and the purchase button will do nothing.
     */
    androidApiKey: 'goog_RcWNrNzLjAQCXUHFrsNElNZjTBd',
    entitlementId: 'NumerologiaAI Pro',
    alternativeIds: ['monthly', 'yearly', 'numerologia_pro'],
    offeringId: 'default',
};

/** True if Android is still using the placeholder key (offerings won't load, purchases won't work). */
export const isAndroidKeyPlaceholder =
    typeof RevenueCatConfig.androidApiKey === 'string' && RevenueCatConfig.androidApiKey.includes('REPLACE');
