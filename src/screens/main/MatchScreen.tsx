import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Heart, Sparkles } from 'lucide-react-native';
import { AIService } from '../../services/ai';
import { useSettings } from '../../context/SettingsContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { PurchasesPackage } from 'react-native-purchases';
import Purchases from 'react-native-purchases';
import { ActivityIndicator } from 'react-native';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { useUser } from '../../context/UserContext';

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'Match'>,
    StackScreenProps<RootStackParamList>
>;

import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

type MatchStep = 'input' | 'scanning' | 'result';

export const MatchScreen: React.FC<Props> = ({ route, navigation }) => {
    const { lifePath } = route.params;
    const { language, t } = useSettings();
    const { isPro, purchasePackage } = useRevenueCat();
    const { userProfile, numerologyResults } = useUser();

    // Hooks must be called unconditionally
    const [step, setStep] = useState<MatchStep>('input');
    const [partnerDate, setPartnerDate] = useState(new Date(1995, 0, 1));
    const [showPicker, setShowPicker] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const scanRotation = useSharedValue(0);

    const animatedScanStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${scanRotation.value}deg` }],
    }));

    const handleBack = () => {
        if (userProfile && numerologyResults) {
            navigation.navigate('Home', {
                name: userProfile.name,
                language: language,
                reading: numerologyResults.reading || '',
                lifePath: numerologyResults.lifePath,
                destiny: numerologyResults.destiny,
                soulUrge: numerologyResults.soulUrge,
                personality: numerologyResults.personality,
                personalYear: numerologyResults.personalYear || 0,
                dailyNumber: numerologyResults.dailyNumber || 0,
            });
        } else {
            navigation.goBack();
        }
    };

    // Conditional return AFTER hooks
    if (!isPro) {
        return <MatchPaywallOverlay onBack={handleBack} purchasePackage={purchasePackage} />;
    }

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

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                {step === 'input' && (
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Heart color={Colors.primary} size={48} fill={Colors.primary} />
                            <MysticalText variant="h1" style={styles.title}>{t('soulMatch')}</MysticalText>
                            <MysticalText style={styles.subtitle}>{t('alignVibrations')}</MysticalText>
                        </View>

                        <GlassCard style={styles.card}>
                            <MysticalText variant="subtitle" style={styles.label}>{t('enterPartnerDate')}</MysticalText>
                            <TouchableOpacity
                                style={styles.dateSelector}
                                onPress={() => setShowPicker(!showPicker)}
                            >
                                <MysticalText variant="h2" color="#ffffff">
                                    {partnerDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </MysticalText>
                            </TouchableOpacity>

                            {showPicker && (
                                <DateTimePicker
                                    value={partnerDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event: any, selectedDate?: Date) => {
                                        if (Platform.OS === 'android') {
                                            setShowPicker(false);
                                        }
                                        if (selectedDate) setPartnerDate(selectedDate);
                                    }}
                                    textColor="#ffffff"
                                    themeVariant="dark"
                                />
                            )}
                        </GlassCard>

                        <Button title={t('commenceAlignment')} onPress={handleStartScan} />
                    </View>
                )}

                {step === 'scanning' && (
                    <View style={styles.centerContent}>
                        <Animated.View style={[styles.scanner, animatedScanStyle]}>
                            <Sparkles color={Colors.primary} size={60} />
                        </Animated.View>
                        <MysticalText variant="h2" style={styles.scanText}>{t('scanningVibrations')}</MysticalText>
                        <MysticalText style={styles.scanSub}>{t('readingThreads')}</MysticalText>
                    </View>
                )}

                {step === 'result' && (
                    <ScrollView contentContainerStyle={styles.scroll}>
                        <View style={styles.header}>
                            <Sparkles color={Colors.primary} size={32} />
                            <MysticalText variant="h1">{t('theVerdict')}</MysticalText>
                        </View>

                        <GlassCard style={styles.resultCard}>
                            <MysticalText style={styles.analysisText}>
                                {analysis}
                            </MysticalText>
                        </GlassCard>

                        <Button
                            title={t('newAnalysis')}
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

const MatchPaywallOverlay = ({ onBack, purchasePackage }: { onBack: () => void, purchasePackage: (pkg: PurchasesPackage) => Promise<void> }) => {
    const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const loadOfferings = async () => {
            try {
                const offerings = await Purchases.getOfferings();
                if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                    setPkg(offerings.current.availablePackages[0]);
                }
            } catch (e) {
                console.error('Error fetching offerings:', e);
            } finally {
                setLoading(false);
            }
        };
        loadOfferings();
    }, []);

    const handlePurchase = async () => {
        if (!pkg) return;
        try {
            await purchasePackage(pkg);
        } catch (e) {
            console.log('Purchase cancelled or failed');
        }
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                <View style={styles.paywallContainer}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft color={Colors.textSecondary} size={24} />
                        <MysticalText style={styles.backText}>Back to Home</MysticalText>
                    </TouchableOpacity>

                    <View style={styles.paywallContent}>
                        <View style={styles.lockIconContainer}>
                            <Lock color={Colors.primary} size={50} />
                        </View>

                        <MysticalText variant="h2" style={styles.paywallTitle}>
                            Soul Match Locked
                        </MysticalText>

                        <MysticalText style={styles.paywallSubtitle}>
                            Start your 7-day free trial to align your vibrations with another soul.
                        </MysticalText>

                        {loading ? (
                            <ActivityIndicator color={Colors.primary} />
                        ) : (
                            <View style={styles.offerContainer}>
                                <MysticalText style={styles.priceText}>
                                    Free for 7 days, then {pkg?.product.priceString}/month
                                </MysticalText>

                                <Button
                                    title="Start Your 7-Day Free Trial"
                                    onPress={handlePurchase}
                                    style={styles.paywallBtn}
                                />

                                <MysticalText variant="caption" style={styles.cancelText}>
                                    Cancel anytime.
                                </MysticalText>
                            </View>
                        )}
                    </View>
                </View>
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
    // Paywall Overlay Styles
    paywallContainer: {
        flex: 1,
        padding: 25,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        gap: 10,
    },
    backText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    paywallContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    lockIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    paywallTitle: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 28,
    },
    paywallSubtitle: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    offerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    priceText: {
        marginBottom: 15,
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    paywallBtn: {
        width: '100%',
        marginBottom: 15,
    },
    cancelText: {
        opacity: 0.6,
    }
});
