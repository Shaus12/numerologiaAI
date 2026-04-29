/**
 * Branch-specific onboarding options (ids only). Copy lives in onboarding.*.json via `onboarding_${id}`.
 * Paywall rows use pw_{ls|lr|cr|gr|we}_{0-3}_{title|sub}. Life path blurbs use lifePath{n}{Strength|Shadow|Gift}.
 */

export type OnboardingBranchKey =
    | 'love_single'
    | 'love_rel'
    | 'career'
    | 'growth'
    | 'wellness';

export type OnboardingFrictionOption = {
    id: string;
};

export type OnboardingIdentityOption = {
    id: string;
};

export type OnboardingBranchContent = {
    frictions: OnboardingFrictionOption[];
    identities: OnboardingIdentityOption[];
};

export const ONBOARDING_BRANCHES: Record<OnboardingBranchKey, OnboardingBranchContent> = {
    love_single: {
        frictions: [{ id: 'ls_f1' }, { id: 'ls_f2' }, { id: 'ls_f3' }, { id: 'ls_f4' }],
        identities: [{ id: 'ls_i1' }, { id: 'ls_i2' }, { id: 'ls_i3' }, { id: 'ls_i4' }],
    },
    love_rel: {
        frictions: [{ id: 'lr_f1' }, { id: 'lr_f2' }, { id: 'lr_f3' }, { id: 'lr_f4' }],
        identities: [{ id: 'lr_i1' }, { id: 'lr_i2' }, { id: 'lr_i3' }, { id: 'lr_i4' }],
    },
    career: {
        frictions: [{ id: 'c_f1' }, { id: 'c_f2' }, { id: 'c_f3' }, { id: 'c_f4' }],
        identities: [{ id: 'c_i1' }, { id: 'c_i2' }, { id: 'c_i3' }, { id: 'c_i4' }],
    },
    growth: {
        frictions: [{ id: 'g_f1' }, { id: 'g_f2' }, { id: 'g_f3' }, { id: 'g_f4' }],
        identities: [{ id: 'g_i1' }, { id: 'g_i2' }, { id: 'g_i3' }, { id: 'g_i4' }],
    },
    wellness: {
        frictions: [{ id: 'w_f1' }, { id: 'w_f2' }, { id: 'w_f3' }, { id: 'w_f4' }],
        identities: [{ id: 'w_i1' }, { id: 'w_i2' }, { id: 'w_i3' }, { id: 'w_i4' }],
    },
};

export type OnboardingPaywallFeature = {
    titleKey: string;
    subtitleKey: string;
};

const PW = {
    ls: 'ls',
    lr: 'lr',
    cr: 'cr',
    gr: 'gr',
    we: 'we',
} as const;

function paywallRows(branchAbbr: string): OnboardingPaywallFeature[] {
    return [0, 1, 2, 3].map((i) => ({
        titleKey: `pw_${branchAbbr}_${i}_title`,
        subtitleKey: `pw_${branchAbbr}_${i}_sub`,
    }));
}

export const ONBOARDING_PAYWALL_FEATURES: Record<OnboardingBranchKey, OnboardingPaywallFeature[]> = {
    love_single: paywallRows(PW.ls),
    love_rel: paywallRows(PW.lr),
    career: paywallRows(PW.cr),
    growth: paywallRows(PW.gr),
    wellness: paywallRows(PW.we),
};

export type LifePathKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type LifePathContent = {
    strengthKey: string;
    shadowKey: string;
    giftArchetypeKey: string;
};

export const LIFE_PATH_DATA: Record<LifePathKey, LifePathContent> = {
    1: { strengthKey: 'lifePath1Strength', shadowKey: 'lifePath1Shadow', giftArchetypeKey: 'lifePath1Gift' },
    2: { strengthKey: 'lifePath2Strength', shadowKey: 'lifePath2Shadow', giftArchetypeKey: 'lifePath2Gift' },
    3: { strengthKey: 'lifePath3Strength', shadowKey: 'lifePath3Shadow', giftArchetypeKey: 'lifePath3Gift' },
    4: { strengthKey: 'lifePath4Strength', shadowKey: 'lifePath4Shadow', giftArchetypeKey: 'lifePath4Gift' },
    5: { strengthKey: 'lifePath5Strength', shadowKey: 'lifePath5Shadow', giftArchetypeKey: 'lifePath5Gift' },
    6: { strengthKey: 'lifePath6Strength', shadowKey: 'lifePath6Shadow', giftArchetypeKey: 'lifePath6Gift' },
    7: { strengthKey: 'lifePath7Strength', shadowKey: 'lifePath7Shadow', giftArchetypeKey: 'lifePath7Gift' },
    8: { strengthKey: 'lifePath8Strength', shadowKey: 'lifePath8Shadow', giftArchetypeKey: 'lifePath8Gift' },
    9: { strengthKey: 'lifePath9Strength', shadowKey: 'lifePath9Shadow', giftArchetypeKey: 'lifePath9Gift' },
};
