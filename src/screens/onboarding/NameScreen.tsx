import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

interface NameScreenProps {
    onContinue: (name: string) => void;
    onBack: () => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const posthog = usePostHog();
    const [name, setName] = useState('');

    const canContinue = name.trim().length > 0;

    const handleContinue = () => {
        if (!canContinue) return;
        try {
            if (posthog) {
                posthog.capture('onboarding_step_completed', { step_name: 'name', step_number: 2 });
            }
        } catch (_) {}
        onContinue(name.trim());
    };

    return (
        <GradientBackground style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <OnboardingHeader step={2} totalSteps={7} onBack={onBack} />

                <View style={styles.content}>
                    <View style={styles.titleWrap}>
                        <MysticalText variant="h1" style={styles.titleLine}>{t('nameTitleLine1')}</MysticalText>
                        <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine}>{t('nameTitleLine2')}</MysticalText>
                    </View>
                    <MysticalText variant="subtitle" style={styles.subtitle}>
                        {t('nameSubtitle')}
                    </MysticalText>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('namePlaceholder')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            autoCapitalize="words"
                            returnKeyType="done"
                            onSubmitEditing={handleContinue}
                        />
                        <View style={styles.inputLine} />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Button
                        title={t('continue')}
                        onPress={handleContinue}
                        disabled={!canContinue}
                        style={!canContinue ? styles.disabledButton : undefined}
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
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 40,
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
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        marginTop: 4,
    },
    input: {
        fontSize: 28,
        color: Colors.text,
        paddingVertical: 10,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputLine: {
        height: 1,
        backgroundColor: Colors.primary,
        opacity: 0.5,
    },
    footer: {
        paddingBottom: 40,
        paddingTop: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
});
