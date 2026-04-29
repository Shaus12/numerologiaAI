import {
    ONBOARDING_BRANCHES,
    type OnboardingBranchKey,
} from '../../constants/onboardingData';
import type { OnboardingState } from '../../store/onboardingStore';
import { resolveOnboardingString } from './onboardingLocale';
import type { Language } from './translations';

function resolveOnboardingLine(language: Language, id: string, fallbackKey: string, hardFallback: string): string {
    if (!id) {
        return resolveOnboardingString(language, fallbackKey) ?? hardFallback;
    }
    const key = `onboarding_${id}`;
    return resolveOnboardingString(language, key) ?? resolveOnboardingString(language, fallbackKey) ?? hardFallback;
}

/** Builds the `userData` object expected by `CalculatingScreen` / AI from onboarding store + app language. */
export function buildCalculatingUserPayload(
    store: Pick<
        OnboardingState,
        'name' | 'birthDate' | 'gender' | 'focusId' | 'branchId' | 'frictionId' | 'identityId'
    >,
    language: Language,
): {
    name: string;
    birthdate: string;
    language: string;
    identity: string;
    focus: string;
    challenge: string;
} {
    const key = store.branchId as OnboardingBranchKey;
    const branch = key ? ONBOARDING_BRANCHES[key] : null;
    const frictionOk = Boolean(branch?.frictions.some((f) => f.id === store.frictionId));
    const identityOk = Boolean(branch?.identities.some((i) => i.id === store.identityId));
    const frictionText = frictionOk
        ? resolveOnboardingLine(
              language,
              store.frictionId,
              'analysisFrictionFallback',
              'the tension you have been feeling lately',
          )
        : resolveOnboardingString(language, 'analysisFrictionFallback') ?? '';
    const identityText = identityOk
        ? resolveOnboardingLine(
              language,
              store.identityId,
              'analysisIdentityFallback',
              'you are not alone in how you feel',
          )
        : resolveOnboardingString(language, 'analysisIdentityFallback') ?? '';
    const challengeFallback =
        resolveOnboardingString(language, 'analysisChallengeFallback') ?? 'personal clarity';
    return {
        name: store.name,
        birthdate: store.birthDate,
        language,
        identity: store.gender,
        focus: store.focusId || 'growth',
        challenge: [frictionText, identityText].filter(Boolean).join(' — ') || challengeFallback,
    };
}
