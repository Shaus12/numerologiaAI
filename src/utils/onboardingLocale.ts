import type { Language } from './translations';

import onboardingAr from '../../constants/onboarding.ar.json';
import onboardingBg from '../../constants/onboarding.bg.json';
import onboardingDe from '../../constants/onboarding.de.json';
import onboardingEn from '../../constants/onboarding.en.json';
import onboardingEs from '../../constants/onboarding.es.json';
import onboardingFr from '../../constants/onboarding.fr.json';
import onboardingHe from '../../constants/onboarding.he.json';
import onboardingPt from '../../constants/onboarding.pt.json';
import onboardingRu from '../../constants/onboarding.ru.json';

const enPack = onboardingEn as Record<string, string>;

function asPack(raw: unknown): Record<string, string> {
    return raw as Record<string, string>;
}

/**
 * Per-locale onboarding copy (options, paywall rows, life-path blurbs, analysis fallbacks).
 * Missing keys fall back via `resolveOnboardingString` to English.
 */
export const ONBOARDING_STRINGS: Record<Language, Record<string, string>> = {
    English: enPack,
    Spanish: asPack(onboardingEs),
    Portuguese: asPack(onboardingPt),
    French: asPack(onboardingFr),
    German: asPack(onboardingDe),
    Russian: asPack(onboardingRu),
    Arabic: asPack(onboardingAr),
    Hebrew: asPack(onboardingHe),
    Bulgarian: asPack(onboardingBg),
};

/** Resolve onboarding-scoped key; falls back to English pack. */
export function resolveOnboardingString(language: Language, key: string): string | undefined {
    const localized = ONBOARDING_STRINGS[language]?.[key];
    if (localized !== undefined && localized !== '') return localized;
    return enPack[key];
}
