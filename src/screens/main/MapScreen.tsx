import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';

const GLASS_CARD_GRADIENT = ['#1a0b2e', '#2d1b4e'] as const;
const SECTION_ACCENT = '#e8d48b';
import { BookOpen, ChevronRight, Lock, ArrowLeft } from 'lucide-react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { useSettings } from '../../context/SettingsContext';
import { useUser } from '../../context/UserContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { NumerologyEngine } from '../../utils/numerology';
import { Button } from '../../components/ui/Button';

type Props = BottomTabScreenProps<MainTabParamList, 'Map'>;

const NumberCard = ({
    value,
    label,
    color,
}: {
    value: number;
    label: string;
    color: string;
}) => (
    <View style={styles.numberCardOuter}>
        <LinearGradient
            colors={GLASS_CARD_GRADIENT}
            style={styles.numberCardInner}
        >
            <MysticalText style={[styles.numberCardValue, { color, lineHeight: 40 }]}>{value}</MysticalText>
            <MysticalText variant="caption" style={styles.numberCardLabel}>{label}</MysticalText>
        </LinearGradient>
    </View>
);

const MapNode = ({
    label,
    value,
    angle,
    color,
}: {
    label: string;
    value: number;
    angle: number;
    color: string;
}) => {
    const radius = 80;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return (
        <View style={[styles.node, { transform: [{ translateX: x }, { translateY: y }] }]}>
            <View style={[styles.nodeCircle, { borderColor: color }]}>
                <MysticalText style={[styles.nodeValue, { color }]}>{value}</MysticalText>
            </View>
            <MysticalText variant="caption" style={styles.nodeLabel}>{label}</MysticalText>
        </View>
    );
};

const ConnectionLine = ({ angle }: { angle: number }) => (
    <View
        style={[
            styles.line,
            {
                transform: [{ rotate: `${angle}deg` }, { translateX: 35 }],
            },
        ]}
    >
        <View style={styles.lineGlow} />
    </View>
);

const MapPaywallOverlay = ({ onBack, navigation }: { onBack: () => void; navigation: any }) => {
    const { t } = useSettings();
    const openPaywall = () => {
        onBack();
        navigation.navigate('Paywall');
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.paywallContainer}>
                    <TouchableOpacity onPress={onBack} style={styles.paywallBackButton}>
                        <ArrowLeft color={Colors.textSecondary} size={24} />
                        <MysticalText style={styles.paywallBackText}>Back to Home</MysticalText>
                    </TouchableOpacity>

                    <View style={styles.paywallContent}>
                        <View style={styles.paywallLockIcon}>
                            <Lock color={Colors.primary} size={50} />
                        </View>
                        <MysticalText variant="h2" style={styles.paywallTitle}>
                            {t('mapPaywallTitle')}
                        </MysticalText>
                        <MysticalText style={styles.paywallSubtitle}>
                            {t('mapPaywallSubtitle')}
                        </MysticalText>
                        <View style={styles.paywallOffer}>
                            <Button
                                title={t('startFreeTrial')}
                                onPress={openPaywall}
                                style={styles.paywallBtn}
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

export const MapScreen: React.FC<Props> = ({ navigation }) => {
    const { t, language } = useSettings();
    const { userProfile, numerologyResults, isLoading } = useUser();
    const { isPro } = useRevenueCat();

    const name = userProfile?.name ?? '';
    const birthdate = userProfile?.birthdate ?? '';

    const { lifePath, destiny, soulUrge, personality } = useMemo(() => {
        if (!birthdate || !name) {
            return { lifePath: 0, destiny: 0, soulUrge: 0, personality: 0 };
        }
        return {
            lifePath: NumerologyEngine.calculateLifePath(birthdate),
            destiny: NumerologyEngine.calculateDestiny(name),
            soulUrge: NumerologyEngine.calculateSoulUrge(name),
            personality: NumerologyEngine.calculatePersonality(name),
        };
    }, [name, birthdate]);

    const handleBack = () => {
        navigation.navigate('Home', {
            name: userProfile?.name ?? '',
            language: userProfile?.language ?? language ?? 'English',
            reading: numerologyResults?.reading ?? '',
            lifePath: numerologyResults?.lifePath ?? lifePath,
            destiny: numerologyResults?.destiny ?? destiny,
            soulUrge: numerologyResults?.soulUrge ?? soulUrge,
            personality: numerologyResults?.personality ?? personality,
            personalYear: numerologyResults?.personalYear ?? 0,
            dailyNumber: numerologyResults?.dailyNumber ?? 0,
        });
    };

    if (!isPro) {
        return <MapPaywallOverlay onBack={handleBack} navigation={navigation} />;
    }

    const hasUserData = Boolean(name && birthdate);
    const hasReading = Boolean(numerologyResults?.reading?.trim());
    const parentNav = navigation.getParent() as any;

    const onViewFullAnalysis = () => {
        if (!hasReading || !numerologyResults) return;
        const params: RootStackParamList['AnalysisComplete'] = {
            reading: numerologyResults.reading!,
            lifePath: numerologyResults.lifePath ?? lifePath,
            destiny: numerologyResults.destiny ?? destiny,
            soulUrge: numerologyResults.soulUrge ?? soulUrge,
            personality: numerologyResults.personality ?? personality,
            language: userProfile?.language ?? language ?? 'English',
            personalYear: numerologyResults.personalYear ?? NumerologyEngine.calculatePersonalYear(birthdate),
            dailyNumber: numerologyResults.dailyNumber ?? NumerologyEngine.calculateDailyNumber(NumerologyEngine.calculatePersonalYear(birthdate)),
        };
        parentNav?.navigate('AnalysisComplete', params);
    };

    if (isLoading) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <MysticalText variant="body" style={styles.loadingText}>{t('loading')}</MysticalText>
                    </View>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    if (!hasUserData) {
        return (
            <GradientBackground>
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <MysticalText variant="h2" style={styles.headerTitle}>{t('myMap')}</MysticalText>
                        <GlassCard style={styles.emptyCard}>
                            <MysticalText variant="body" style={styles.emptyText}>
                                {t('mapComingSoon')}
                            </MysticalText>
                            <MysticalText variant="caption" style={styles.emptySub}>
                                Complete your profile to see your numerology map.
                            </MysticalText>
                        </GlassCard>
                    </ScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <MysticalText variant="h2" style={styles.headerTitle}>{t('myMap')}</MysticalText>

                    {/* YOUR NUMBERS - 2x2 grid */}
                    <View style={styles.section}>
                        <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('yourNumbers')}</MysticalText>
                        <View style={styles.numbersGrid}>
                            <NumberCard value={lifePath} label={t('lifePath')} color={Colors.primary} />
                            <NumberCard value={destiny} label={t('destiny')} color={Colors.secondary} />
                            <NumberCard value={soulUrge} label={t('soulUrge')} color="#3498db" />
                            <NumberCard value={personality} label={t('personality')} color="#e74c3c" />
                        </View>
                    </View>

                    {/* YOUR NUMEROLOGY MAP - diagram */}
                    <View style={styles.section}>
                        <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('numerologyMap')}</MysticalText>
                        <View style={styles.mapContainer}>
                            <View style={styles.mapGraphic}>
                                <View style={styles.coreNode}>
                                    <View style={[styles.nodeCircle, styles.coreCircle]}>
                                        <MysticalText style={[styles.coreValue, { lineHeight: 40 }]}>{lifePath}</MysticalText>
                                    </View>
                                    <MysticalText variant="caption" style={styles.nodeLabel}>{t('core')}</MysticalText>
                                </View>
                                <MapNode label={t('destiny')} value={destiny} angle={-90} color={Colors.secondary} />
                                <MapNode label={t('soulUrge')} value={soulUrge} angle={30} color="#3498db" />
                                <MapNode label={t('personality')} value={personality} angle={150} color="#e74c3c" />
                                <ConnectionLine angle={-90} />
                                <ConnectionLine angle={30} />
                                <ConnectionLine angle={150} />
                            </View>
                            <View style={styles.legend}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.dot, { backgroundColor: Colors.secondary }]} />
                                    <MysticalText variant="caption" style={styles.legendText}>{t('destiny')}: {destiny}</MysticalText>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.dot, { backgroundColor: '#3498db' }]} />
                                    <MysticalText variant="caption" style={styles.legendText}>{t('soulUrge')}: {soulUrge}</MysticalText>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.dot, { backgroundColor: '#e74c3c' }]} />
                                    <MysticalText variant="caption" style={styles.legendText}>{t('personality')}: {personality}</MysticalText>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* View Full Analysis */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onViewFullAnalysis}
                        style={styles.analysisWrap}
                        disabled={!hasReading}
                    >
                        <GlassCard style={[styles.analysisCard, !hasReading && styles.analysisCardDisabled]}>
                            <View style={styles.oracleIconBox}>
                                <BookOpen color={Colors.primary} size={24} />
                            </View>
                            <View style={styles.oracleTextContent}>
                                <MysticalText variant="subtitle" style={styles.oracleTitle}>{t('viewFullAnalysis')}</MysticalText>
                                <MysticalText variant="caption" style={styles.oracleSub}>
                                    {hasReading ? t('viewFullAnalysisSub') : t('mapComingSoon')}
                                </MysticalText>
                            </View>
                            <ChevronRight color={Colors.textSecondary} size={20} />
                        </GlassCard>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    headerTitle: {
        marginTop: 10,
        marginBottom: 24,
        color: Colors.text,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: { opacity: 0.8 },
    emptyCard: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: { marginBottom: 8 },
    emptySub: { opacity: 0.7, textAlign: 'center' },

    section: { marginBottom: 25 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: SECTION_ACCENT,
        letterSpacing: 2,
        marginTop: 22,
        marginBottom: 22,
        textTransform: 'uppercase',
    },
    numbersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    numberCardOuter: {
        width: '47%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 10,
    },
    numberCardInner: {
        paddingVertical: 18,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        overflow: 'hidden',
    },
    numberCardValue: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 6,
    },
    numberCardLabel: {
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 11,
    },

    mapContainer: {
        paddingVertical: 30,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    mapGraphic: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    coreNode: {
        zIndex: 10,
        alignItems: 'center',
    },
    nodeCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coreCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderColor: Colors.primary,
        borderWidth: 2,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.85,
        shadowRadius: 20,
        elevation: 12,
    },
    coreValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.primary,
    },
    node: {
        position: 'absolute',
        alignItems: 'center',
    },
    nodeValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    nodeLabel: {
        marginTop: 4,
        fontSize: 9,
    },
    line: {
        position: 'absolute',
        width: 40,
        height: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineGlow: {
        position: 'absolute',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(212, 175, 55, 0.5)',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 2,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 10,
        color: Colors.textSecondary,
    },

    analysisWrap: { marginTop: 8 },
    analysisCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 15,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    analysisCardDisabled: {
        opacity: 0.7,
    },
    oracleIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    oracleTextContent: { flex: 1 },
    oracleTitle: { fontSize: 16, fontWeight: '700' },
    oracleSub: { fontSize: 12, color: Colors.textSecondary },

    paywallContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    paywallBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
        paddingRight: 16,
    },
    paywallBackText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    paywallContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paywallLockIcon: {
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
        opacity: 0.8,
        marginBottom: 28,
        paddingHorizontal: 16,
    },
    paywallOffer: {
        width: '100%',
        alignItems: 'center',
    },
    paywallBtn: {
        marginBottom: 12,
    },
    paywallCancel: {
        opacity: 0.7,
    },
});
