import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { TouchableOpacity as GHTouchable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, Home } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useSettings } from '../../context/SettingsContext';
import { NumerologyEngine } from '../../utils/numerology';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeEnergy'>;

export const HomeEnergyScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useSettings();
    const [input, setInput] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleBack = () => {
        Keyboard.dismiss();
        navigation.goBack();
    };

    const cleaned = (input || '').toUpperCase().replace(/[\s\W]/g, '');
    const canAnalyze = cleaned.length > 0;

    const handleAnalyze = () => {
        if (!canAnalyze || isCalculating) return;
        setIsCalculating(true);
        setTimeout(() => {
            const energy = NumerologyEngine.getHomeEnergy(input);
            setResult(energy);
            setIsCalculating(false);
        }, 2000);
    };

    const handleClear = () => {
        setResult(null);
        setInput('');
        inputRef.current?.focus();
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.headerRow}>
                    <View style={styles.header}>
                        <GHTouchable
                            onPress={handleBack}
                            style={styles.backBtn}
                            activeOpacity={0.7}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <ArrowLeft color={Colors.textSecondary} size={24} />
                        </GHTouchable>
                        <View style={styles.headerTitleWrap}>
                            <Home color={Colors.primary} size={22} />
                            <MysticalText variant="h2" style={styles.headerTitle}>
                                {t('homeEnergyTitle')}
                            </MysticalText>
                        </View>
                        <View style={styles.headerSpacer} />
                    </View>
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardView}
                >
                    <View style={styles.ltrContainer}>
                    <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <MysticalText style={styles.subtitle}>
                                {t('homeEnergySubtitle')}
                            </MysticalText>
                            <MysticalText variant="caption" style={styles.toolExplanation}>
                                {t('homeEnergyToolExplanation')}
                            </MysticalText>

                            <GlassCard style={styles.inputCard} border>
                                <TextInput
                                    ref={inputRef}
                                    style={styles.input}
                                    placeholder={t('homeEnergyPlaceholder')}
                                    placeholderTextColor={Colors.textSecondary}
                                    value={input}
                                    onChangeText={setInput}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                    maxLength={20}
                                    editable={result === null && !isCalculating}
                                />
                                <Button
                                    title={t('homeEnergyAnalyze')}
                                    onPress={handleAnalyze}
                                    disabled={!canAnalyze || isCalculating}
                                    style={styles.analyzeBtn}
                                />
                            </GlassCard>

                            {isCalculating && (
                                <View style={styles.calculatingWrap}>
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                    <MysticalText variant="body" style={styles.calculatingText}>
                                        {t('toolkitCalculating')}
                                    </MysticalText>
                                </View>
                            )}

                            {!isCalculating && result !== null && result >= 1 && result <= 9 && (
                                <View style={styles.resultSection}>
                                    <View style={styles.resultNumberWrap}>
                                        <MysticalText style={styles.resultNumber}>
                                            {result}
                                        </MysticalText>
                                        <MysticalText variant="caption" style={styles.resultLabel}>
                                            {t('homeEnergyResultLabel')}
                                        </MysticalText>
                                    </View>
                                    <GlassCard style={styles.meaningCard} border>
                                        <MysticalText variant="subtitle" style={styles.meaningTitle}>
                                            {(t as (k: string) => string)(`homeEnergy${result}Title`)}
                                        </MysticalText>
                                        <MysticalText style={styles.meaningDesc}>
                                            {(t as (k: string) => string)(`homeEnergy${result}Desc`)}
                                        </MysticalText>
                                        <View style={styles.tipBlock}>
                                            <MysticalText variant="caption" style={styles.tipLabel}>
                                                {t('homeEnergyTipLabel')}
                                            </MysticalText>
                                            <MysticalText style={styles.tipText}>
                                                {(t as (k: string) => string)(`homeEnergy${result}Tip`)}
                                            </MysticalText>
                                        </View>
                                    </GlassCard>
                                    <TouchableOpacity
                                        onPress={handleClear}
                                        style={styles.clearBtn}
                                        activeOpacity={0.8}
                                    >
                                        <MysticalText style={styles.clearBtnText}>
                                            {t('homeEnergyClear')}
                                        </MysticalText>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    headerRow: {
        direction: 'ltr',
    },
    ltrContainer: {
        direction: 'ltr',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    backBtn: {
        minWidth: 56,
        minHeight: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
        paddingVertical: 16,
        paddingRight: 24,
    },
    headerTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        color: Colors.text,
        fontSize: 20,
    },
    headerSpacer: { width: 80 },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    subtitle: {
        color: Colors.textSecondary,
        marginBottom: 12,
        fontSize: 15,
        opacity: 0.95,
    },
    toolExplanation: {
        color: Colors.textSecondary,
        marginBottom: 20,
        fontSize: 13,
        lineHeight: 19,
        opacity: 0.9,
    },
    inputCard: {
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
        backgroundColor: 'rgba(26, 11, 46, 0.5)',
    },
    input: {
        backgroundColor: 'rgba(10, 6, 18, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 18,
        color: Colors.text,
        marginBottom: 16,
    },
    analyzeBtn: {
        alignSelf: 'stretch',
    },
    resultSection: {
        marginTop: 8,
    },
    resultNumberWrap: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resultNumber: {
        fontSize: 72,
        fontWeight: '700',
        color: Colors.primary,
        lineHeight: 84,
    },
    resultLabel: {
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 4,
    },
    meaningCard: {
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
        backgroundColor: 'rgba(26, 11, 46, 0.5)',
    },
    meaningTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 12,
    },
    meaningDesc: {
        fontSize: 15,
        lineHeight: 22,
        color: Colors.text,
        opacity: 0.95,
        marginBottom: 16,
    },
    tipBlock: {
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    tipLabel: {
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
    tipText: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.text,
        opacity: 0.9,
    },
    clearBtn: {
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    clearBtnText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 15,
    },
    calculatingWrap: {
        marginTop: 24,
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calculatingText: {
        color: Colors.textSecondary,
        marginTop: 16,
        opacity: 0.95,
    },
});
