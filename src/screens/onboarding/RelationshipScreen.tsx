import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Heart, User, Users, Star, HelpCircle } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';
import { useSettings } from '../../context/SettingsContext';

interface RelationshipScreenProps {
    onContinue: (status: string) => void;
}

const STATUSES = [
    { id: 'single', labelKey: 'statusSingle' as const, subKey: 'statusSingleSub' as const, icon: Heart },
    { id: 'relationship', labelKey: 'statusRelationship' as const, subKey: 'statusRelationshipSub' as const, icon: Users },
    { id: 'married', labelKey: 'statusMarried' as const, subKey: 'statusMarriedSub' as const, icon: Star },
    { id: 'complicated', labelKey: 'statusComplicated' as const, subKey: 'statusComplicatedSub' as const, icon: HelpCircle },
    { id: 'private', labelKey: 'statusPrivate' as const, subKey: 'statusPrivateSub' as const, icon: User },
];

export const RelationshipScreen: React.FC<RelationshipScreenProps> = ({ onContinue }) => {
    const { t } = useSettings();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={5} totalSteps={10} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                delaysContentTouches={false}
            >
                <MysticalText variant="h1" style={styles.title}>
                    {t('relationshipTitleLine1')} {'\n'}
                    <MysticalText variant="h1" color={Colors.primary}>{t('relationshipTitleLine2')}</MysticalText>
                </MysticalText>

                <MysticalText style={styles.subtitle}>
                    {t('relationshipSubtitle')}
                </MysticalText>

                <View style={styles.options}>
                    {STATUSES.map((item) => (
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
