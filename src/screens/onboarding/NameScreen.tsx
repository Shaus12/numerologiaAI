import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { ChevronLeft } from 'lucide-react-native';

interface NameScreenProps {
    onContinue: (name: string) => void;
    onBack: () => void;
}

import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

export const NameScreen: React.FC<NameScreenProps> = ({ onContinue, onBack }) => {
    const [name, setName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    return (
        <GradientBackground style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <OnboardingHeader step={3} totalSteps={10} onBack={onBack} />

                <View style={styles.header}>
                    <MysticalText variant="h1" style={styles.title}>
                        What is your {'\n'}
                        <MysticalText variant="h1" color={Colors.primary}>full name?</MysticalText>
                    </MysticalText>
                    <MysticalText variant="subtitle" style={styles.subtitle}>
                        Your name holds the key to your destiny in the Pythagorean system.
                    </MysticalText>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        autoCapitalize="words"
                    />
                    <View style={styles.inputLine} />
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Continue"
                        onPress={() => onContinue(name)}
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
        paddingTop: 60,
    },
    keyboardView: {
        flex: 1,
        paddingBottom: 50,
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
    title: {
        marginBottom: 10,
        fontSize: 28,
    },
    subtitle: {
        fontSize: 14,
    },
    inputContainer: {
        marginTop: 20,
        flex: 1,
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
        marginTop: 'auto',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
