import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { TouchableOpacity as GHTouchable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { ArrowLeft, Calendar, Lock } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useSettings } from '../../context/SettingsContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { NumerologyEngine } from '../../utils/numerology';
import { localeForLanguage } from '../../utils/translations';

type Props = NativeStackScreenProps<RootStackParamList, 'DateEnergy'>;

const DateEnergyPaywallOverlay = ({
    onBack,
    onUnlock,
}: {
    onBack: () => void;
    onUnlock: () => void;
}) => {
    const { t } = useSettings();
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.paywallWrap}>
                    <GHTouchable onPress={onBack} style={styles.backBtn} activeOpacity={0.7} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                        <ArrowLeft color={Colors.textSecondary} size={24} />
                    </GHTouchable>
                    <View style={styles.paywallContent}>
                        <View style={styles.lockIconWrap}>
                            <Lock color={Colors.primary} size={50} />
                        </View>
                        <MysticalText variant="h2" style={styles.paywallTitle}>
                            {t('dateEnergyPaywallTitle')}
                        </MysticalText>
                        <MysticalText style={styles.paywallSubtitle}>
                            {t('dateEnergyPaywallSubtitle')}
                        </MysticalText>
                        <View style={styles.paywallCtaWrap}>
                            <Button
                                title={t('startFreeTrial')}
                                onPress={onUnlock}
                                style={styles.paywallCta}
                            />
                            <MysticalText variant="caption" style={styles.paywallCancel}>
                                {t('trialSubtext')}
                            </MysticalText>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};

export const DateEnergyScreen: React.FC<Props> = ({ navigation }) => {
    const { t, language } = useSettings();
    const { isPro } = useRevenueCat();
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    const handleBack = () => {
        Keyboard.dismiss();
        navigation.goBack();
    };

    const handleUnlock = () => {
        navigation.navigate('Paywall');
    };

    const locale = localeForLanguage[language as keyof typeof localeForLanguage] || 'en-US';

    const handleAnalyze = () => {
        if (isCalculating) return;
        setIsCalculating(true);
        setTimeout(() => {
            const energy = NumerologyEngine.getDateEnergy(selectedDate);
            setResult(energy);
            setIsCalculating(false);
        }, 2000);
    };

    const handleClear = () => {
        setResult(null);
        setSelectedDate(new Date());
        setShowDatePicker(false);
    };

    if (!isPro) {
        return (
            <DateEnergyPaywallOverlay onBack={handleBack} onUnlock={handleUnlock} />
        );
    }

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
                            <Calendar color={Colors.primary} size={22} />
                            <MysticalText variant="h2" style={styles.headerTitle}>
                                {t('dateEnergyTitle')}
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
                                {t('dateEnergySubtitle')}
                            </MysticalText>

                            <GlassCard style={styles.inputCard} border>
                                <MysticalText variant="caption" style={styles.fieldLabel}>
                                    {t('dateEnergySelectDate')}
                                </MysticalText>
                                <TouchableOpacity
                                    style={styles.dateTouchable}
                                    onPress={() => setShowDatePicker((v) => !v)}
                                    activeOpacity={0.8}
                                    disabled={result !== null}
                                >
                                    <Calendar color={Colors.primary} size={20} />
                                    <MysticalText variant="body" style={styles.dateDisplayText}>
                                        {selectedDate.toLocaleDateString(locale, {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </MysticalText>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <View style={styles.datePickerWrap}>
                                        <DateTimePicker
                                            value={selectedDate}
                                            mode="date"
                                            display={Platform.OS === 'android' ? 'default' : 'spinner'}
                                            onChange={(_, d) => {
                                                if (d) setSelectedDate(d);
                                                if (Platform.OS === 'android') setShowDatePicker(false);
                                            }}
                                            textColor="#fff"
                                            themeVariant="dark"
                                        />
                                    </View>
                                )}

                                <Button
                                    title={t('dateEnergyAnalyze')}
                                    onPress={handleAnalyze}
                                    disabled={isCalculating}
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
                                            {t('dateEnergyResultLabel')}
                                        </MysticalText>
                                    </View>
                                    <GlassCard style={styles.meaningCard} border>
                                        <MysticalText variant="subtitle" style={styles.meaningTitle}>
                                            {(t as (k: string) => string)(`dateEnergy${result}Title`)}
                                        </MysticalText>
                                        <MysticalText style={styles.meaningDesc}>
                                            {(t as (k: string) => string)(`dateEnergy${result}Desc`)}
                                        </MysticalText>
                                        <View style={styles.tipBlock}>
                                            <MysticalText variant="caption" style={styles.tipLabel}>
                                                {t('dateEnergyTipLabel')}
                                            </MysticalText>
                                            <MysticalText style={styles.tipText}>
                                                {(t as (k: string) => string)(`dateEnergy${result}Tip`)}
                                            </MysticalText>
                                        </View>
                                    </GlassCard>
                                    <TouchableOpacity
                                        onPress={handleClear}
                                        style={styles.clearBtn}
                                        activeOpacity={0.8}
                                    >
                                        <MysticalText style={styles.clearBtnText}>
                                            {t('dateEnergyClear')}
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
    headerRow: { direction: 'ltr' },
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
        marginBottom: 24,
        fontSize: 15,
        opacity: 0.95,
    },
    inputCard: {
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
        backgroundColor: 'rgba(26, 11, 46, 0.5)',
    },
    fieldLabel: {
        color: Colors.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    dateTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(10, 6, 18, 0.8)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
    },
    dateDisplayText: {
        color: Colors.text,
        fontSize: 17,
    },
    datePickerWrap: {
        marginBottom: 16,
        alignItems: 'center',
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
    paywallWrap: {
        flex: 1,
        paddingHorizontal: 24,
    },
    paywallContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockIconWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    paywallTitle: {
        textAlign: 'center',
        marginBottom: 12,
    },
    paywallSubtitle: {
        textAlign: 'center',
        opacity: 0.85,
        marginBottom: 28,
        paddingHorizontal: 16,
    },
    paywallCtaWrap: {
        width: '100%',
        alignItems: 'center',
    },
    paywallCta: {
        marginBottom: 12,
    },
    paywallCancel: {
        opacity: 0.7,
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
