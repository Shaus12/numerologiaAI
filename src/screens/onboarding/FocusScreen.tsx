import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Briefcase, Heart, Sparkles, Activity } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

interface FocusScreenProps {
    onContinue: (focus: string) => void;
    onBack?: () => void;
}

const FOCI = [
    { id: 'career', labelKey: 'focusCareer' as const, subKey: 'focusCareerSub' as const, icon: Briefcase },
    { id: 'love', labelKey: 'focusLove' as const, subKey: 'focusLoveSub' as const, icon: Heart },
    { id: 'spiritual', labelKey: 'focusSpiritual' as const, subKey: 'focusSpiritualSub' as const, icon: Sparkles },
    { id: 'health', labelKey: 'focusHealth' as const, subKey: 'focusHealthSub' as const, icon: Activity },
];

export const FocusScreen: React.FC<FocusScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const posthog = usePostHog();

    const handleSelect = (focus: string) => {
        if (posthog) {
            posthog.capture('onboarding_step_completed', { step_name: 'focus', step_number: 5 });
        }
        onContinue(focus);
    };

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={5} totalSteps={7} onBack={onBack} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                delaysContentTouches={false}
            >
                <View style={styles.titleWrap}>
                    <MysticalText variant="h1" style={styles.titleLine}>{t('focusTitleLine1')}</MysticalText>
                    <MysticalText variant="h1" style={styles.titleLine}>
                        <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine}>{t('focusTitleLine2')}</MysticalText> {t('focusTitleLine3')}
                    </MysticalText>
                </View>

                <MysticalText style={styles.subtitle}>
                    {t('focusSubtitle')}
                </MysticalText>

                <View style={styles.options}>
                    {FOCI.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => handleSelect(item.id)} activeOpacity={0.7}>
                            <GlassCard style={styles.option}>
                                <View style={styles.optionContent}>
                                    <View style={styles.textPart}>
                                        <MysticalText variant="body" style={styles.optionTitle}>{t(item.labelKey)}</MysticalText>
                                        <MysticalText variant="caption" style={styles.optionSub}>{t(item.subKey)}</MysticalText>
                                    </View>
                                    <View style={styles.iconBox}>
                                        <item.icon color={Colors.textSecondary} size={28} />
                                    </View>
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>

                <MysticalText variant="caption" style={styles.footerNote}>
                    {t('focusFooterNote')}
                </MysticalText>
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
    options: { gap: 15 },
    option: { padding: 20 },
    optionContent: { flexDirection: 'row', alignItems: 'center' },
    textPart: { flex: 1, paddingRight: 10 },
    optionTitle: { fontWeight: '700', fontSize: 18 },
    optionSub: { marginTop: 5, opacity: 0.6 },
    iconBox: { width: 56, height: 56, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    footerNote: { textAlign: 'center', marginTop: 30, opacity: 0.5 },
});
