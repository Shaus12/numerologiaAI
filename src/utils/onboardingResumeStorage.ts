import AsyncStorage from '@react-native-async-storage/async-storage';

import { useOnboardingStore } from '../../store/onboardingStore';
import type { OnboardingState } from '../../store/onboardingStore';

export const ONBOARDING_RESUME_FLAG_KEY = 'onboarding_resume_paywall_v1';
export const ONBOARDING_RESUME_PAYLOAD_KEY = 'onboarding_resume_payload_v1';

export type OnboardingResumePayload = Pick<
    OnboardingState,
    | 'name'
    | 'gender'
    | 'birthDate'
    | 'lifePathNumber'
    | 'focusId'
    | 'relationshipStatus'
    | 'branchId'
    | 'frictionId'
    | 'identityId'
>;

function snapshotOnboardingForResume(): OnboardingResumePayload {
    const s = useOnboardingStore.getState();
    return {
        name: s.name,
        gender: s.gender,
        birthDate: s.birthDate,
        lifePathNumber: s.lifePathNumber,
        focusId: s.focusId,
        relationshipStatus: s.relationshipStatus,
        branchId: s.branchId,
        frictionId: s.frictionId,
        identityId: s.identityId,
    };
}

/** Call after onboarding is complete and the user is heading into pre-paywall analysis. */
export async function persistOnboardingResumeForPaywall(): Promise<void> {
    const snap = snapshotOnboardingForResume();
    if (!snap.name?.trim() || !snap.birthDate?.trim()) return;
    await AsyncStorage.multiSet([
        [ONBOARDING_RESUME_FLAG_KEY, '1'],
        [ONBOARDING_RESUME_PAYLOAD_KEY, JSON.stringify(snap)],
    ]);
}

export async function clearOnboardingResume(): Promise<void> {
    await AsyncStorage.multiRemove([ONBOARDING_RESUME_FLAG_KEY, ONBOARDING_RESUME_PAYLOAD_KEY]);
}

export async function loadOnboardingResumeFromStorage(): Promise<{
    active: boolean;
    payload: OnboardingResumePayload | null;
}> {
    try {
        const [flag, raw] = await Promise.all([
            AsyncStorage.getItem(ONBOARDING_RESUME_FLAG_KEY),
            AsyncStorage.getItem(ONBOARDING_RESUME_PAYLOAD_KEY),
        ]);
        if (flag !== '1' || !raw) return { active: false, payload: null };
        const payload = JSON.parse(raw) as OnboardingResumePayload;
        if (!payload || typeof payload !== 'object' || !payload.name?.trim() || !payload.birthDate?.trim()) {
            return { active: false, payload: null };
        }
        return { active: true, payload };
    } catch {
        return { active: false, payload: null };
    }
}
