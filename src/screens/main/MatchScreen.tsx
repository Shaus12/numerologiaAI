import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Heart, Sparkles } from 'lucide-react-native';
import { AIService } from '../../services/ai';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Match'>;

import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

type MatchStep = 'input' | 'scanning' | 'result';

export const MatchScreen: React.FC<Props> = ({ route }) => {
    const { lifePath, language } = route.params;
    const [step, setStep] = useState<MatchStep>('input');
    const [partnerDate, setPartnerDate] = useState(new Date(1995, 0, 1));
    const [showPicker, setShowPicker] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const scanRotation = useSharedValue(0);

    const handleStartScan = async () => {
        setStep('scanning');
        scanRotation.value = 0;
        scanRotation.value = withRepeat(
            withTiming(360, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );

        try {
            const result = await AIService.calculateCompatibility(lifePath, partnerDate.toISOString(), language);
            setAnalysis(result);
            // Stay in scanning for a bit for effect
            setTimeout(() => {
                setStep('result');
            }, 3000);
        } catch (error) {
            console.error(error);
            setStep('input');
        }
    };

    const animatedScanStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${scanRotation.value}deg` }],
    }));

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                {step === 'input' && (
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Heart color={Colors.primary} size={48} fill={Colors.primary} />
                            <MysticalText variant="h1" style={styles.title}>Soul Match</MysticalText>
                            <MysticalText style={styles.subtitle}>Align your vibrations with another soul</MysticalText>
                        </View>

                        <GlassCard style={styles.card}>
                            <MysticalText variant="subtitle" style={styles.label}>ENTER PARTNER'S BIRTHDATE</MysticalText>
                            <TouchableOpacity
                                style={styles.dateSelector}
                                onPress={() => setShowPicker(true)}
                            >
                                <MysticalText variant="h2" color={Colors.primary}>
                                    {partnerDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </MysticalText>
                            </TouchableOpacity>

                            {showPicker && (
                                <DateTimePicker
                                    value={partnerDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event: any, selectedDate?: Date) => {
                                        setShowPicker(false);
                                        if (selectedDate) setPartnerDate(selectedDate);
                                    }}
                                />
                            )}
                        </GlassCard>

                        <Button title="Commence Alignment" onPress={handleStartScan} />
                    </View>
                )}

                {step === 'scanning' && (
                    <View style={styles.centerContent}>
                        <Animated.View style={[styles.scanner, animatedScanStyle]}>
                            <Sparkles color={Colors.primary} size={60} />
                        </Animated.View>
                        <MysticalText variant="h2" style={styles.scanText}>Scanning Vibrations...</MysticalText>
                        <MysticalText style={styles.scanSub}>Reading the numerical threads that bind you</MysticalText>
                    </View>
                )}

                {step === 'result' && (
                    <ScrollView contentContainerStyle={styles.scroll}>
                        <View style={styles.header}>
                            <Sparkles color={Colors.primary} size={32} />
                            <MysticalText variant="h1">The Verdict</MysticalText>
                        </View>

                        <GlassCard style={styles.resultCard}>
                            <MysticalText style={styles.analysisText}>
                                {analysis}
                            </MysticalText>
                        </GlassCard>

                        <Button
                            title="New Analysis"
                            variant="primary"
                            onPress={() => setStep('input')}
                            style={styles.newButton}
                        />
                    </ScrollView>
                )}
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1 },
    content: { flex: 1, padding: 25, justifyContent: 'center' },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    scroll: { padding: 25 },
    header: { alignItems: 'center', marginBottom: 40, gap: 10 },
    title: { fontSize: 32 },
    subtitle: { color: Colors.textSecondary, textAlign: 'center', fontSize: 16 },
    card: { padding: 30, marginBottom: 30, gap: 20 },
    label: { fontSize: 12, letterSpacing: 2, textAlign: 'center' },
    dateSelector: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    scanner: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 75,
        borderStyle: 'dashed',
    },
    scanText: { marginBottom: 10, textAlign: 'center' },
    scanSub: { color: Colors.textSecondary, textAlign: 'center', fontStyle: 'italic' },
    resultCard: { padding: 25, marginBottom: 20 },
    analysisText: { fontSize: 16, lineHeight: 26, opacity: 0.9 },
    newButton: { marginTop: 10 },
});
