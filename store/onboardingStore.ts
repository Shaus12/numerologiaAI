import { create } from 'zustand';

import type { OnboardingBranchKey } from '../constants/onboardingData';

/** Focus areas that map to onboarding branches (love splits by relationship status). */
export type FocusId = 'love' | 'career' | 'growth' | 'wellness';

export type RelationshipStatus = 'single' | 'in_relationship' | null;

/** Branch driving Steps 6–7 and paywall personalization. */
export type BranchId = OnboardingBranchKey | '';

export interface OnboardingState {
    name: string;
    gender: string;
    birthDate: string;
    lifePathNumber: number | null;
    focusId: FocusId | '';
    relationshipStatus: RelationshipStatus;
    branchId: BranchId;
    frictionId: string;
    identityId: string;

    setBasicInfo: (name: string, gender: string, birthDate: string) => void;
    setFocus: (focusId: FocusId, relationshipStatus: RelationshipStatus) => void;
    setPsychology: (frictionId: string, identityId: string) => void;
    resetOnboarding: () => void;
}

const initialState = {
    name: '',
    gender: '',
    birthDate: '',
    lifePathNumber: null as number | null,
    focusId: '' as FocusId | '',
    relationshipStatus: null as RelationshipStatus,
    branchId: '' as BranchId,
    frictionId: '',
    identityId: '',
};

/**
 * Reduces a date string to a single digit 1–9 by summing all digits repeatedly.
 * Master numbers (11, 22, etc.) are not preserved — they reduce further.
 */
export function calculateLifePath(date: string): number | null {
    const digitsOnly = date.replace(/\D/g, '');
    if (!digitsOnly) return null;

    let sum = 0;
    for (let i = 0; i < digitsOnly.length; i++) {
        const n = digitsOnly.charCodeAt(i) - 48;
        if (n >= 0 && n <= 9) sum += n;
    }

    if (sum === 0) return null;

    while (sum > 9) {
        let next = 0;
        let x = sum;
        while (x > 0) {
            next += x % 10;
            x = Math.floor(x / 10);
        }
        sum = next;
    }

    return sum;
}

function resolveBranchId(focusId: FocusId, relationshipStatus: RelationshipStatus): BranchId {
    if (focusId === 'love') {
        if (relationshipStatus === 'single') return 'love_single';
        if (relationshipStatus === 'in_relationship') return 'love_rel';
        // Love selected but status unknown yet — safe default for downstream UI
        return 'love_single';
    }
    return focusId;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
    ...initialState,

    setBasicInfo: (name, gender, birthDate) =>
        set(() => ({
            name,
            gender,
            birthDate,
            lifePathNumber: calculateLifePath(birthDate),
        })),

    setFocus: (focusId, relationshipStatus) =>
        set(() => ({
            focusId,
            relationshipStatus,
            branchId: resolveBranchId(focusId, relationshipStatus),
        })),

    setPsychology: (frictionId, identityId) =>
        set(() => ({
            frictionId,
            identityId,
        })),

    resetOnboarding: () => set(() => ({ ...initialState })),
}));
