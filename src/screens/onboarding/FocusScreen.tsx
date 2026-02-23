import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Briefcase, Heart, Sparkles, Activity } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';

interface FocusScreenProps {
    onContinue: (focus: string) => void;
}

const FOCI = [
    { id: 'career', labelKey: 'focusCareer' as const, subKey: 'focusCareerSub' as const, icon: Briefcase },
    { id: 'love', labelKey: 'focusLove' as const, subKey: 'focusLoveSub' as const, icon: Heart },
    { id: 'spiritual', labelKey: 'focusSpiritual' as const, subKey: 'focusSpiritualSub' as const, icon: Sparkles },
    { id: 'health', labelKey: 'focusHealth' as const, subKey: 'focusHealthSub' as const, icon: Activity },
];

export const FocusScreen: React.FC<FocusScreenProps> = ({ onContinue }) => {
    const { t } = useSettings();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={6} totalSteps={10} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                delaysContentTouches={false}
            >
                <MysticalText variant="h1" style={styles.title}>
                    {t('focusTitleLine1')} {'\n'}
                    <MysticalText variant="h1" color={Colors.primary}>{t('focusTitleLine2')}</MysticalText> {t('focusTitleLine3')}
                </MysticalText>

                <MysticalText style={styles.subtitle}>
                    {t('focusSubtitle')}
                </MysticalText>

                <View style={styles.options}>
                    {FOCI.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => setSelected(item.id)} activeOpacity={0.7}>
                            <GlassCard style={[styles.option, selected === item.id && styles.optionActive]} border={selected === item.id}>
                                <View style={styles.optionContent}>
                                    <View style={styles.textPart}>
                                        <MysticalText variant="body" style={styles.optionTitle}>{t(item.labelKey)}</MysticalText>
                                        <MysticalText variant="caption" style={styles.optionSub}>{t(item.subKey)}</MysticalText>
                                    </View>
                                    <View style={styles.iconBox}>
                                        <item.icon color={selected === item.id ? Colors.primary : Colors.textSecondary} size={28} />
                                    </View>
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>

                <MysticalText variant="caption" style={styles.footerNote}>
                    {t('focusFooterNote')}
                </MysticalText>
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
    options: { gap: 15 },
    option: { padding: 20 },
    optionActive: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: Colors.primary },
    optionContent: { flexDirection: 'row', alignItems: 'center' },
    textPart: { flex: 1, paddingRight: 10 },
    optionTitle: { fontWeight: '700', fontSize: 18 },
    optionSub: { marginTop: 5, opacity: 0.6 },
    iconBox: { width: 56, height: 56, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    footerNote: { textAlign: 'center', marginTop: 30, opacity: 0.5 },
    footer: { padding: 25, paddingBottom: 50 },
});
