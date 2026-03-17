import React, { useState } from 'react';
import { StyleSheet, View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

interface NameScreenProps {
    onContinue: (name: string) => void;
    onBack: () => void;
}

import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

export const NameScreen: React.FC<NameScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const posthog = usePostHog();
    const [name, setName] = useState('');

    const handleContinue = () => {
        try {
            if (posthog) {
                posthog.capture('onboarding_step_completed', { step_name: 'enter_name', step_number: 4 });
            }
        } catch (_) {}
        onContinue(name);
    };

    return (
        <GradientBackground style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <OnboardingHeader step={3} totalSteps={11} onBack={onBack} />

                    <View style={styles.header}>
                        <View style={styles.titleWrap}>
                            <MysticalText variant="h1" style={styles.titleLine}>{t('nameTitleLine1')}</MysticalText>
                            <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine}>{t('nameTitleLine2')}</MysticalText>
                        </View>
                        <MysticalText variant="subtitle" style={styles.subtitle}>
                            {t('nameSubtitle')}
                        </MysticalText>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('namePlaceholder')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            autoCapitalize="words"
                        />
                        <View style={styles.inputLine} />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title={t('continue')}
                        onPress={handleContinue}
                        disabled={!name.trim()}
                        style={!name.trim() && styles.disabledButton}
                    />
                </View>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
    },
    keyboardView: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    backButton: {
        marginBottom: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepText: {
        color: Colors.primary,
        fontWeight: '700',
    },
    percentText: {
        color: Colors.textSecondary,
    },
    progressBarBg: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        marginBottom: 40,
    },
    progressBarFilled: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    header: {
        marginBottom: 40,
    },
    titleWrap: {
        marginBottom: 10,
        alignItems: 'center',
    },
    titleLine: {
        textAlign: 'center',
        fontSize: 28,
    },
    subtitle: {
        fontSize: 14,
    },
    inputContainer: {
        marginTop: 20,
        minHeight: 120,
    },
    input: {
        fontSize: 24,
        color: Colors.text,
        paddingVertical: 10,
        fontWeight: '600',
    },
    inputLine: {
        height: 1,
        backgroundColor: Colors.primary,
        opacity: 0.5,
    },
    footer: {
        paddingHorizontal: 0,
        paddingBottom: 40,
        paddingTop: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
});
