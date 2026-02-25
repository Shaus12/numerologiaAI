import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Sparkles } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';

interface AIConsentScreenProps {
    onBack: () => void;
    onContinue: () => void;
}

export const AIConsentScreen: React.FC<AIConsentScreenProps> = ({ onBack, onContinue }) => {
    const { t } = useSettings();

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={10} totalSteps={10} onBack={onBack} />

            <View style={styles.header}>
                <View style={styles.iconWrap}>
                    <Sparkles color={Colors.primary} size={32} />
                </View>
                <MysticalText variant="h1" style={styles.title}>
                    {t('aiConsentTitle')}
                </MysticalText>
                <MysticalText variant="subtitle" style={styles.subtitle}>
                    {t('aiConsentBody')}
                </MysticalText>
            </View>

            <GlassCard style={styles.card}>
                <MysticalText variant="caption" style={styles.cardNote}>
                    {t('aiConsentNote')}
                </MysticalText>
            </GlassCard>

            <View style={styles.footer}>
                <Button title={t('aiConsentAccept')} onPress={onContinue} />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        paddingBottom: 50,
    },
    header: {
        marginBottom: 24,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        marginBottom: 12,
    },
    subtitle: {
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    card: {
        marginBottom: 30,
        padding: 18,
    },
    cardNote: {
        color: Colors.textSecondary,
        opacity: 0.9,
        lineHeight: 20,
    },
    footer: {
        marginTop: 'auto',
    },
});
