import {
    LIFE_PATH_DATA,
    ONBOARDING_BRANCHES,
    type LifePathKey,
    type OnboardingBranchKey,
} from '../../constants/onboardingData';
import type { OnboardingState } from '../../store/onboardingStore';
import { resolveOnboardingString } from './onboardingLocale';
import type { Language } from './translations';

function clampLifePath(n: number | null): LifePathKey {
    if (n != null && n >= 1 && n <= 9) return n as LifePathKey;
    return 9;
}

type StoreSlice = Pick<
    OnboardingState,
    'name' | 'lifePathNumber' | 'branchId' | 'frictionId' | 'identityId'
>;

/** Strip trailing sentence punctuation for safe re-wrapping into a new sentence. */
export function stripTerminalPunctuation(s: string): string {
    return (s ?? '').trim().replace(/[.!?…]+$/u, '').trim();
}

function resolveOnboardingLine(language: Language, id: string, fallbackKey: string, hardFallback: string): string {
    if (!id) {
        return resolveOnboardingString(language, fallbackKey) ?? hardFallback;
    }
    const key = `onboarding_${id}`;
    return resolveOnboardingString(language, key) ?? resolveOnboardingString(language, fallbackKey) ?? hardFallback;
}

/**
 * Part B: shadow + friction + identity as clean prose (no duplicate periods or placeholders).
 */
export function composeBlockParagraph(
    shadowSentence: string,
    frictionText: string,
    identityText: string,
    language: Language = 'English',
): string {
    const shadow = shadowSentence.trim().replace(/\s+/g, ' ');
    const fr = stripTerminalPunctuation(frictionText);
    const id = stripTerminalPunctuation(identityText);
    const frCont = fr.length > 0 ? fr.charAt(0).toLowerCase() + fr.slice(1) : fr;
    const idCont = id.length > 0 ? id.charAt(0).toLowerCase() + id.slice(1) : id;

    const whenTpl =
        resolveOnboardingString(language, 'analysisBlockWhen') ??
        resolveOnboardingString('English', 'analysisBlockWhen') ??
        'This often shows up when {{x}}.';
    const insideTpl =
        resolveOnboardingString(language, 'analysisBlockInside') ??
        resolveOnboardingString('English', 'analysisBlockInside') ??
        'Inside, it can feel like {{x}}.';

    const mid1 = whenTpl.replace('{{x}}', frCont);
    const mid2 = insideTpl.replace('{{x}}', idCont);
    return `${shadow} ${mid1} ${mid2}`.replace(/\s+/g, ' ');
}

/** Same resolution rules as `AnalysisScreen` (strength/shadow punctuation, fallbacks). */
export function buildAnalysisCopy(state: StoreSlice, language: Language = 'English') {
    const name = state.name;
    const lifePathNumber = state.lifePathNumber;
    const branchId = state.branchId as OnboardingBranchKey | '';
    const frictionId = state.frictionId;
    const identityId = state.identityId;

    const lp = clampLifePath(lifePathNumber);
    const lpRow = LIFE_PATH_DATA[lp];
    const strength =
        resolveOnboardingString(language, lpRow.strengthKey) ??
        resolveOnboardingString('English', lpRow.strengthKey) ??
        '';
    const shadow =
        resolveOnboardingString(language, lpRow.shadowKey) ??
        resolveOnboardingString('English', lpRow.shadowKey) ??
        '';
    const giftArchetype =
        resolveOnboardingString(language, lpRow.giftArchetypeKey) ??
        resolveOnboardingString('English', lpRow.giftArchetypeKey) ??
        '';

    const branch = branchId && ONBOARDING_BRANCHES[branchId] ? ONBOARDING_BRANCHES[branchId] : null;
    const frictionFromBranch = branch?.frictions.some((x) => x.id === frictionId);
    const identityFromBranch = branch?.identities.some((x) => x.id === identityId);
    const frictionText = frictionFromBranch
        ? resolveOnboardingLine(language, frictionId, 'analysisFrictionFallback', 'the tension you have been feeling lately')
        : resolveOnboardingString(language, 'analysisFrictionFallback') ?? 'the tension you have been feeling lately';
    const identityText = identityFromBranch
        ? resolveOnboardingLine(language, identityId, 'analysisIdentityFallback', 'you are not alone in how you feel')
        : resolveOnboardingString(language, 'analysisIdentityFallback') ?? 'you are not alone in how you feel';

    const displayName = (name ?? '').trim() || 'Seeker';
    const lpLabel = lifePathNumber != null && lifePathNumber >= 1 && lifePathNumber <= 9 ? lifePathNumber : lp;

    const strengthSentence = `${(strength || '').trim().replace(/\.$/, '')}.`;
    const shadowSentence = `${(shadow || '').trim().replace(/\.$/, '')}.`;

    const paragraph = `${displayName}, as a Life Path ${lpLabel}, your core strength is your ${strengthSentence} But here is the truth: ${shadowSentence} This energetic clash is exactly why you are experiencing ${frictionText}, and it completely explains why you feel that ${identityText} You don't need to change who you are. You just need to align your numbers.`;

    const blockParagraph = composeBlockParagraph(shadowSentence, frictionText, identityText, language);

    return {
        displayName,
        lpLabel,
        lpResolved: lp,
        strength,
        shadow,
        giftArchetype,
        strengthSentence,
        shadowSentence,
        frictionText,
        identityText,
        paragraph,
        blockParagraph,
    };
}
