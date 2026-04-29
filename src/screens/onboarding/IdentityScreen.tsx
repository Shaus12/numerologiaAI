import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { User, UserPlus, Users, EyeOff } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

interface IdentityScreenProps {
    onContinue: (identity: string) => void;
    onBack: () => void;
}

const OPTIONS = [
    { id: 'male',       labelKey: 'male' as const,           icon: User },
    { id: 'female',     labelKey: 'female' as const,         icon: UserPlus },
    { id: 'non-binary', labelKey: 'nonBinary' as const,      icon: Users },
    { id: 'private',    labelKey: 'preferNotToSay' as const, icon: EyeOff },
];

export const IdentityScreen: React.FC<IdentityScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const posthog = usePostHog();

    const handleSelect = (id: string) => {
        try {
            if (posthog) {
                posthog.capture('onboarding_step_completed', { step_name: 'identity', step_number: 3 });
            }
        } catch (_) {}
        onContinue(id);
    };

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={3} totalSteps={7} onBack={onBack} />

            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <MysticalText variant="h1" style={styles.title}>{t('identityTitle')}</MysticalText>
                    <MysticalText variant="h1" style={styles.titleAccent}> {t('identityTitleAccent')}</MysticalText>
                </View>
                <MysticalText variant="subtitle" style={styles.subtitle}>
                    {t('identitySubtitle')}
                </MysticalText>
            </View>

            <View style={styles.optionsGrid}>
                {OPTIONS.map((item) => {
                    const Icon = item.icon;
                    const isFullWidth = item.id === 'private';
                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => handleSelect(item.id)}
                            style={({ pressed }) => [
                                isFullWidth ? styles.fullWidthOption : styles.halfWidthOption,
                                pressed && styles.pressed,
                            ]}
                        >
                            {({ pressed }) => (
                                <GlassCard
                                    style={[styles.optionCard, pressed && styles.selectedCard]}
                                    border={pressed}
                                >
                                    <View style={[styles.iconBox, pressed && styles.iconBoxActive]}>
                                        <Icon
                                            color={pressed ? Colors.primary : Colors.textSecondary}
                                            size={24}
                                        />
                                    </View>
                                    <MysticalText variant="body" style={styles.optionLabel}>
                                        {t(item.labelKey)}
                                    </MysticalText>
                                </GlassCard>
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        paddingBottom: 50,
    },
    header: {
        marginBottom: 40,
        marginTop: 8,
    },
    titleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
    },
    titleAccent: {
        color: Colors.primary,
        fontSize: 28,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    halfWidthOption: {
        width: '48%',
        marginBottom: 15,
    },
    fullWidthOption: {
        width: '100%',
        marginBottom: 15,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        height: 80,
    },
    selectedCard: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    iconBoxActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
    },
    optionLabel: {
        fontWeight: '600',
    },
});
