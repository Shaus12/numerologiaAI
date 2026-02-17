import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Sun, Book, Users, Eye } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

interface ExpectationsScreenProps {
    onContinue: (expectations: string[]) => void;
}

const EXPECTATIONS = [
    { id: 'guidance', label: 'Daily Guidance', sub: 'Start each day with cosmic insights', icon: Sun },
    { id: 'knowledge', label: 'Deep Self-Knowledge', sub: 'Understand your true nature', icon: Book },
    { id: 'compatibility', label: 'Compatibility Analysis', sub: 'Find your ideal matches', icon: Users },
    { id: 'predictions', label: 'Future Predictions', sub: 'Glimpse what lies ahead', icon: Eye },
];

export const ExpectationsScreen: React.FC<ExpectationsScreenProps> = ({ onContinue }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(i => i !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={8} totalSteps={10} />

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <MysticalText variant="h1" style={styles.title}>
                    What do you expect {'\n'}
                    from <MysticalText variant="h1" color={Colors.primary}>Numerologia AI?</MysticalText>
                </MysticalText>

                <MysticalText style={styles.subtitle}>
                    Select all that apply — we will tailor your experience
                </MysticalText>

                <View style={styles.options}>
                    {EXPECTATIONS.map((item) => {
                        const isActive = selected.includes(item.id);
                        return (
                            <TouchableOpacity key={item.id} onPress={() => toggleSelect(item.id)} activeOpacity={0.7}>
                                <GlassCard style={[styles.option, isActive && styles.optionActive]} border={isActive}>
                                    <View style={styles.iconBox}>
                                        <item.icon color={isActive ? Colors.primary : Colors.textSecondary} size={24} />
                                    </View>
                                    <View style={styles.optionText}>
                                        <MysticalText variant="body" style={styles.optionTitle}>{item.label}</MysticalText>
                                        <MysticalText variant="caption" style={styles.optionSub}>{item.sub}</MysticalText>
                                    </View>
                                    <View style={[styles.checkbox, isActive && styles.checkboxActive]} />
                                </GlassCard>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={() => onContinue(selected)}
                    disabled={selected.length === 0}
                />
                <MysticalText variant="caption" style={styles.footerNote}>
                    Select at least one option
                </MysticalText>
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
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
    checkboxActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    footer: { padding: 25, paddingBottom: 50 },
    footerNote: { textAlign: 'center', marginTop: 15, opacity: 0.5 },
});
