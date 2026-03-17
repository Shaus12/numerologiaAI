import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Clock } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

interface BirthTimeScreenProps {
    onContinue: (knowsTime: boolean) => void;
    onBack?: () => void;
}

export const BirthTimeScreen: React.FC<BirthTimeScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const posthog = usePostHog();
    const [selected, setSelected] = useState<boolean | null>(null);

    const handleContinue = () => {
        try {
            if (posthog) {
                posthog.capture('onboarding_step_completed', { step_name: 'birth_time', step_number: 5 });
            }
        } catch (_) {}
        onContinue(selected === true);
    };

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={4} totalSteps={11} onBack={onBack} />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Clock color={Colors.primary} size={40} />
                </View>

                <View style={styles.titleWrap}>
                    <MysticalText variant="h1" style={styles.titleLine}>{t('birthTimeTitleLine1')}</MysticalText>
                    <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine}>{t('birthTimeTitleLine2')}</MysticalText>
                </View>

                <MysticalText style={styles.subtitle}>
                    {t('birthTimeSubtitle')}
                </MysticalText>

                <View style={styles.options}>
                    <Option
                        title={t('birthTimeYes')}
                        sub={t('birthTimeYesSub')}
                        active={selected === true}
                        onPress={() => setSelected(true)}
                    />
                    <Option
                        title={t('birthTimeNo')}
                        sub={t('birthTimeNoSub')}
                        active={selected === false}
                        onPress={() => setSelected(false)}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title={t('continue')}
                    onPress={handleContinue}
                    disabled={selected === null}
                />
            </View>
        </GradientBackground>
    );
};

const Option = ({ title, sub, active, onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
        <GlassCard style={[styles.option, active && styles.optionActive]} border={active}>
            <View style={styles.optionText}>
                <MysticalText variant="body" style={styles.optionTitle}>{title}</MysticalText>
                <MysticalText variant="caption" style={styles.optionSub}>{sub}</MysticalText>
            </View>
            <View style={[styles.radio, active && styles.radioActive]} />
        </GlassCard>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, paddingHorizontal: 25, alignItems: 'center' },
    iconContainer: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(155, 89, 182, 0.2)', // Purple tint for clock
        justifyContent: 'center', alignItems: 'center', marginBottom: 25,
    },
    titleWrap: { marginBottom: 15, alignItems: 'center' },
    titleLine: { textAlign: 'center' },
    subtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 40 },
    options: { width: '100%', gap: 15 },
    option: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    optionActive: { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
    optionText: { flex: 1 },
    optionTitle: { fontWeight: '700' },
    optionSub: { marginTop: 4, opacity: 0.6 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
    radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    footer: { padding: 25, paddingBottom: 50 },
});
