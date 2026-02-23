import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { User, UserPlus, Users, EyeOff, ChevronLeft } from 'lucide-react-native';
import { useSettings } from '../../context/SettingsContext';

interface IdentityOption {
    id: string;
    label: string;
    icon: React.ElementType;
}

interface IdentityScreenProps {
    onContinue: (identity: string) => void;
    onBack: () => void;
}

import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

export const IdentityScreen: React.FC<IdentityScreenProps> = ({ onContinue, onBack }) => {
    const { t } = useSettings();
    const [selected, setSelected] = useState('private');

    const options: IdentityOption[] = [
        { id: 'male', label: t('male'), icon: User },
        { id: 'female', label: t('female'), icon: UserPlus },
        { id: 'non-binary', label: t('nonBinary'), icon: Users },
        { id: 'private', label: t('preferNotToSay'), icon: EyeOff },
    ];

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={2} totalSteps={10} onBack={onBack} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
                delaysContentTouches={false}
            >
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <MysticalText variant="h1" style={styles.title}>{t('identityTitle')}</MysticalText>
                        <MysticalText variant="h1" style={styles.titleAccent}>{t('identityTitleAccent')}</MysticalText>
                    </View>
                    <MysticalText variant="subtitle" style={styles.subtitle}>
                        {t('identitySubtitle')}
                    </MysticalText>
                </View>

                <View style={styles.optionsGrid}>
                    {options.map((item) => {
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
                <Button title={t('continue')} onPress={() => onContinue(selected)} />
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
