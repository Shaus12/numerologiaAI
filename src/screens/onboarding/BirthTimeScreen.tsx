import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Clock } from 'lucide-react-native';
import { OnboardingHeader } from '../../components/shared/OnboardingHeader';

interface BirthTimeScreenProps {
    onContinue: (knowsTime: boolean) => void;
}

export const BirthTimeScreen: React.FC<BirthTimeScreenProps> = ({ onContinue }) => {
    const [selected, setSelected] = useState<boolean | null>(null);

    return (
        <GradientBackground style={styles.container}>
            <OnboardingHeader step={4} totalSteps={10} />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Clock color={Colors.primary} size={40} />
                </View>

                <MysticalText variant="h1" style={styles.title}>
                    Do you know your {'\n'}
                    <MysticalText variant="h1" color={Colors.primary}>birth time?</MysticalText>
                </MysticalText>

                <MysticalText style={styles.subtitle}>
                    Your exact birth time unlocks deeper astrological insights.
                </MysticalText>

                <View style={styles.options}>
                    <Option
                        title="Yes, I know it"
                        sub="I will enter my birth time"
                        active={selected === true}
                        onPress={() => setSelected(true)}
                    />
                    <Option
                        title="No, I do not know"
                        sub="Skip this step"
                        active={selected === false}
                        onPress={() => setSelected(false)}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={() => onContinue(selected === true)}
                    disabled={selected === null}
                />
            </View>
        </GradientBackground>
    );
};

const Option = ({ title, sub, active, onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
        <GlassCard style={[styles.option, active && styles.optionActive]} border={active}>
            <View style={styles.optionText}>
                <MysticalText variant="body" style={styles.optionTitle}>{title}</MysticalText>
                <MysticalText variant="caption" style={styles.optionSub}>{sub}</MysticalText>
            </View>
            <View style={[styles.radio, active && styles.radioActive]} />
        </GlassCard>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, paddingHorizontal: 25, alignItems: 'center' },
    iconContainer: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(155, 89, 182, 0.2)', // Purple tint for clock
        justifyContent: 'center', alignItems: 'center', marginBottom: 25,
    },
    title: { textAlign: 'center', marginBottom: 15 },
    subtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 40 },
    options: { width: '100%', gap: 15 },
    option: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    optionActive: { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
    optionText: { flex: 1 },
    optionTitle: { fontWeight: '700' },
    optionSub: { marginTop: 4, opacity: 0.6 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
    radioActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    footer: { padding: 25, paddingBottom: 50 },
});
