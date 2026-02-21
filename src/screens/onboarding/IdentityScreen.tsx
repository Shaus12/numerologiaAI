import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { User, UserPlus, Users, EyeOff, ChevronLeft } from 'lucide-react-native';

interface IdentityOption {
    id: string;
    label: string;
    icon: React.ElementType;
}

const OPTIONS: IdentityOption[] = [
    { id: 'male', label: 'Male', icon: User },
    { id: 'female', label: 'Female', icon: UserPlus },
    { id: 'non-binary', label: 'Non-binary', icon: Users },
    { id: 'private', label: 'Prefer not to say', icon: EyeOff },
];

interface IdentityScreenProps {
    onContinue: (identity: string) => void;
    onBack: () => void;
}

import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

export const IdentityScreen: React.FC<IdentityScreenProps> = ({ onContinue, onBack }) => {
    const [selected, setSelected] = useState('private');

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={2} totalSteps={10} onBack={onBack} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <MysticalText variant="h1" style={styles.title}>
                        How do you {'\n'}
                        <MysticalText variant="h1" color={Colors.primary}>identify?</MysticalText>
                    </MysticalText>
                    <MysticalText variant="subtitle" style={styles.subtitle}>
                        This helps us personalize your numerology readings
                    </MysticalText>
                </View>

                <View style={styles.optionsGrid}>
                    {OPTIONS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelected(item.id)}
                                activeOpacity={0.7}
                                style={item.id === 'private' ? styles.fullWidthOption : styles.halfWidthOption}
                            >
                                <GlassCard
                                    style={[
                                        styles.optionCard,
                                        selected === item.id && styles.selectedCard,
                                    ]}
                                    border={selected === item.id}
                                >
                                    <View style={[styles.iconBox, selected === item.id && styles.iconBoxActive]}>
                                        <Icon color={selected === item.id ? Colors.primary : Colors.textSecondary} size={24} />
                                    </View>
                                    <MysticalText variant="body" style={styles.optionLabel}>
                                        {item.label}
                                    </MysticalText>
                                </GlassCard>
                            </TouchableOpacity>
                        );
                    })}
                </View>
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
        paddingTop: 60,
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
    scroll: {
        flex: 1,
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
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        height: 80,
    },
    selectedCard: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
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
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    optionLabel: {
        fontWeight: '600',
    },
    footer: {
        marginTop: 20,
    },
});
