import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Compass, Shield, Zap, TrendingUp, Scale } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

interface ChallengeScreenProps {
    onContinue: (challenge: string) => void;
    onBack?: () => void;
}

const CHALLENGES = [
    { id: 'purpose', labelKey: 'challengePurpose' as const, subKey: 'challengePurposeSub' as const, icon: Compass },
    { id: 'relationships', labelKey: 'challengeRelationships' as const, subKey: 'challengeRelationshipsSub' as const, icon: Zap },
    { id: 'career', labelKey: 'challengeCareer' as const, subKey: 'challengeCareerSub' as const, icon: TrendingUp },
    { id: 'confidence', labelKey: 'challengeConfidence' as const, subKey: 'challengeConfidenceSub' as const, icon: Shield },
    { id: 'balance', labelKey: 'challengeBalance' as const, subKey: 'challengeBalanceSub' as const, icon: Scale },
];

export const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const posthog = usePostHog();

    const handleSelect = (challenge: string) => {
        if (posthog) {
            posthog.capture('onboarding_step_completed', { step_name: 'challenge', step_number: 6 });
        }
        onContinue(challenge);
    };

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={6} totalSteps={7} onBack={onBack} />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" delaysContentTouches={false}>
                <View style={styles.titleWrap}>
                    <MysticalText variant="h1" style={styles.titleLine}>{t('challengeTitleLine1')}</MysticalText>
                    <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine}>{t('challengeTitleLine2')}</MysticalText>
                </View>

                <MysticalText style={styles.subtitle}>
                    {t('challengeSubtitle')}
                </MysticalText>

                <View style={styles.options}>
                    {CHALLENGES.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => handleSelect(item.id)} activeOpacity={0.7}>
                            <GlassCard style={styles.option}>
                                <View style={styles.iconBox}>
                                    <item.icon color={Colors.textSecondary} size={24} />
                                </View>
                                <View style={styles.optionText}>
                                    <MysticalText variant="body" style={styles.optionTitle}>{t(item.labelKey)}</MysticalText>
                                    <MysticalText variant="caption" style={styles.optionSub}>{t(item.subKey)}</MysticalText>
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 25, paddingBottom: 20 },
    titleWrap: { marginBottom: 15, alignItems: 'center' },
    titleLine: { textAlign: 'center' },
    subtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 35 },
    options: { gap: 12 },
    option: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    optionText: { flex: 1 },
    optionTitle: { fontWeight: '700' },
    optionSub: { marginTop: 2, opacity: 0.6 },
});
