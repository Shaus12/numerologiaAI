import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, KeyboardAvoidingView, Platform, ScrollView, findNodeHandle } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { MapPin } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

export interface PlaceOfBirthResult {
    country: string;
    city: string;
}

interface PlaceOfBirthScreenProps {
    onContinue: (place: PlaceOfBirthResult) => void;
    onBack: () => void;
}

export const PlaceOfBirthScreen: React.FC<PlaceOfBirthScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const posthog = usePostHog();
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const scrollRef = useRef<ScrollView>(null);
    const citySectionRef = useRef<View>(null);

    const handleContinue = () => {
        try {
            if (posthog) {
                posthog.capture('onboarding_step_completed', { step_name: 'place_of_birth', step_number: 12 });
            }
        } catch (_) {}
        onContinue({ country: country.trim(), city: city.trim() });
    };

    const scrollToCityField = () => {
        const scroll = scrollRef.current;
        const citySection = citySectionRef.current;
        if (!scroll || !citySection) return;
        const scrollNode = findNodeHandle(scroll as any);
        if (!scrollNode) return;
        citySection.measureLayout(
            scrollNode,
            (_x, y) => {
                scrollRef.current?.scrollTo({
                    y: Math.max(0, y - 60),
                    animated: true,
                });
            },
            () => {},
        );
    };

    const onCountryFocus = () => {
        setTimeout(scrollToCityField, 400);
    };

    return (
        <GradientBackground style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    ref={scrollRef}
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <OnboardingHeader step={10} totalSteps={11} onBack={onBack} />

                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <MapPin color={Colors.primary} size={40} />
                        </View>
                        <View style={styles.titleWrap}>
                            <MysticalText variant="h1" style={styles.titleLine}>{t('placeOfBirthTitleLine1')}</MysticalText>
                            {(t('placeOfBirthTitleLine2') || '').trim() ? (
                                <MysticalText variant="h1" color={Colors.primary} style={styles.titleLine}>{t('placeOfBirthTitleLine2')}</MysticalText>
                            ) : null}
                        </View>
                        <MysticalText variant="subtitle" style={styles.subtitle}>
                            {t('placeOfBirthSubtitle')}
                        </MysticalText>
                    </View>

                    <View style={styles.inputContainer}>
                        <MysticalText variant="caption" style={styles.fieldLabel}>{t('placeOfBirthCountry')}</MysticalText>
                        <TextInput
                            style={styles.input}
                            placeholder={t('placeOfBirthCountryPlaceholder')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={country}
                            onChangeText={setCountry}
                            onFocus={onCountryFocus}
                            autoCapitalize="words"
                        />
                        <View style={styles.inputLine} />
                        <View ref={citySectionRef} collapsable={false}>
                            <MysticalText variant="caption" style={[styles.fieldLabel, styles.fieldLabelSecond]}>{t('placeOfBirthCity')}</MysticalText>
                            <TextInput
                                style={styles.input}
                                placeholder={t('placeOfBirthCityPlaceholder')}
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={city}
                                onChangeText={setCity}
                                autoCapitalize="words"
                            />
                            <View style={styles.inputLine} />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button title={t('continue')} onPress={handleContinue} />
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
    header: {
        marginBottom: 28,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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
    },
    fieldLabel: {
        marginBottom: 4,
        opacity: 0.8,
    },
    fieldLabelSecond: {
        marginTop: 18,
    },
    inputContainer: {
        minHeight: 160,
    },
    input: {
        fontSize: 18,
        color: Colors.text,
        paddingVertical: 12,
        fontWeight: '500',
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
});
