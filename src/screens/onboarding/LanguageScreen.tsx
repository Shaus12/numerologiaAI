import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Globe } from 'lucide-react-native';

interface Language {
    id: string;
    name: string;
    flag: string;
}

const LANGUAGES: Language[] = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
];

interface LanguageScreenProps {
    onContinue: (lang: string) => void;
}

import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

export const LanguageScreen: React.FC<LanguageScreenProps> = ({ onContinue }) => {
    const [selected, setSelected] = useState('en');

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={1} totalSteps={10} />
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Globe color={Colors.primary} size={40} />
                </View>
                <MysticalText variant="h1" style={styles.title}>
                    Choose your {'\n'}
                    <MysticalText variant="h1" color={Colors.primary}>language</MysticalText>
                </MysticalText>
                <MysticalText variant="subtitle" style={styles.subtitle}>
                    Select your preferred language for a personalized experience.
                </MysticalText>
            </View>

            <ScrollView
                style={styles.listContainer}
                keyboardShouldPersistTaps="handled"
            >
                {LANGUAGES.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => setSelected(item.id)}
                        activeOpacity={0.7}
                    >
                        <GlassCard
                            style={[
                                styles.langItem,
                                selected === item.id && styles.selectedItem,
                            ]}
                            border={selected === item.id}
                        >
                            <MysticalText style={styles.langFlag}>{item.flag}</MysticalText>
                            <MysticalText variant="body" style={styles.langName}>
                                {item.name}
                            </MysticalText>
                            <View style={[styles.radio, selected === item.id && styles.radioActive]} />
                        </GlassCard>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Button title="Continue" onPress={() => onContinue(selected)} />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        paddingTop: 80,
        paddingBottom: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
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
    title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        textAlign: 'center',
        paddingHorizontal: 20,
        fontSize: 14,
    },
    listContainer: {
        flex: 1,
    },
    langItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 15,
    },
    selectedItem: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    langFlag: {
        fontSize: 24,
        marginRight: 15,
    },
    langName: {
        flex: 1,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    radioActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    footer: {
        marginTop: 20,
    },
});
