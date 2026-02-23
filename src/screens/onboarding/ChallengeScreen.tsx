import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Compass, Shield, Zap, TrendingUp, Scale } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';

interface ChallengeScreenProps {
    onContinue: (challenge: string) => void;
}

const CHALLENGES = [
    { id: 'purpose', labelKey: 'challengePurpose' as const, subKey: 'challengePurposeSub' as const, icon: Compass },
    { id: 'relationships', labelKey: 'challengeRelationships' as const, subKey: 'challengeRelationshipsSub' as const, icon: Zap },
    { id: 'career', labelKey: 'challengeCareer' as const, subKey: 'challengeCareerSub' as const, icon: TrendingUp },
    { id: 'confidence', labelKey: 'challengeConfidence' as const, subKey: 'challengeConfidenceSub' as const, icon: Shield },
    { id: 'balance', labelKey: 'challengeBalance' as const, subKey: 'challengeBalanceSub' as const, icon: Scale },
];

export const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ onContinue }) => {
    const { t } = useSettings();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={7} totalSteps={10} />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" delaysContentTouches={false}>
                <MysticalText variant="h1" style={styles.title}>
                    {t('challengeTitleLine1')} {'\n'}
                    <MysticalText variant="h1" color={Colors.primary}>{t('challengeTitleLine2')}</MysticalText>
                </MysticalText>

                <MysticalText style={styles.subtitle}>
                    {t('challengeSubtitle')}
                </MysticalText>

                <View style={styles.options}>
                    {CHALLENGES.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => setSelected(item.id)} activeOpacity={0.7}>
                            <GlassCard style={[styles.option, selected === item.id && styles.optionActive]} border={selected === item.id}>
                                <View style={styles.iconBox}>
                                    <item.icon color={selected === item.id ? Colors.primary : Colors.textSecondary} size={24} />
                                </View>
                                <View style={styles.optionText}>
                                    <MysticalText variant="body" style={styles.optionTitle}>{t(item.labelKey)}</MysticalText>
                                    <MysticalText variant="caption" style={styles.optionSub}>{t(item.subKey)}</MysticalText>
                                </View>
                                {selected === item.id && (
                                    <View style={styles.checkCircle}>
                                        <View style={styles.checkInner} />
                                    </View>
                                )}
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={t('continue')}
                    onPress={() => onContinue(selected!)}
                    disabled={selected === null}
                />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 25, paddingBottom: 20 },
    title: { textAlign: 'center', marginBottom: 15 },
    subtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 35 },
    options: { gap: 12 },
    option: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    optionActive: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: Colors.primary },
    iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    optionText: { flex: 1 },
    optionTitle: { fontWeight: '700' },
    optionSub: { marginTop: 2, opacity: 0.6 },
    checkCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
    checkInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0a0612' },
    footer: { padding: 25, paddingBottom: 50 },
});
