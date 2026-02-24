import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Share as RNShare } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { Sparkles, ChevronRight, BookOpen, Share2 } from 'lucide-react-native';
import { AIService } from '../../services/ai';
import { touchDebug } from '../../utils/touchDebug';
import { useSettings } from '../../context/SettingsContext';
import { useUser } from '../../context/UserContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { localeForLanguage } from '../../utils/translations';
import { requestNotificationPermissions, scheduleDailyMorningReminder } from '../../utils/notifications';

export type DailyInsightData = {
    cosmicMessage: string;
    energyScore: number;
    luckyHour: string;
    luckyColor: string;
};

function extractJsonString(raw: string): string {
    let s = raw.trim();
    // Strip markdown code fences (e.g. ```json ... ``` or ``` ... ```)
    const codeFence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/;
    const match = s.match(codeFence);
    if (match) s = match[1].trim();
    return s;
}

function parseDailyInsight(raw: string): DailyInsightData {
    const toParse = extractJsonString(raw);
    try {
        const parsed = JSON.parse(toParse) as Record<string, unknown>;
        const cosmicMessage = typeof parsed.cosmicMessage === 'string' && parsed.cosmicMessage.trim()
            ? parsed.cosmicMessage.trim() : 'Trust your intuition today.';
        const energyScore = typeof parsed.energyScore === 'number' && parsed.energyScore >= 1 && parsed.energyScore <= 100
            ? Math.round(parsed.energyScore) : 50;
        const luckyHour = typeof parsed.luckyHour === 'string' && parsed.luckyHour.trim()
            ? parsed.luckyHour.trim() : '—';
        const luckyColor = typeof parsed.luckyColor === 'string' && parsed.luckyColor.trim()
            ? parsed.luckyColor.trim() : '—';
        return { cosmicMessage, energyScore, luckyHour, luckyColor };
    } catch {
        // Not valid JSON: treat whole response as cosmic message only
        return {
            cosmicMessage: raw.trim() || 'Trust your intuition today.',
            energyScore: 50,
            luckyHour: '—',
            luckyColor: '—',
        };
    }
}

type Props = BottomTabScreenProps<MainTabParamList, 'Home'> & {
    route: { params?: MainTabParamList['Home'] & { openDailyInsight?: boolean } }
};

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
    const { language, t } = useSettings();
    const { userProfile, numerologyResults } = useUser();
    const { isPro } = useRevenueCat();

    const hasStoredReading = Boolean(numerologyResults?.reading?.trim());

    const onAnalysisCardPress = () => {
        if (!hasStoredReading) return;
        const parent = navigation.getParent();
        const params: RootStackParamList['AnalysisComplete'] = {
            reading: numerologyResults!.reading!,
            lifePath: numerologyResults!.lifePath ?? 0,
            destiny: numerologyResults!.destiny ?? 0,
            soulUrge: numerologyResults!.soulUrge ?? 0,
            personality: numerologyResults!.personality ?? 0,
            language: userProfile?.language ?? language,
            personalYear: numerologyResults!.personalYear ?? 0,
            dailyNumber: numerologyResults!.dailyNumber ?? 0,
        };
        (parent as any)?.navigate('AnalysisComplete', params);
    };

    // Use context (persistent) data as primary, route.params as fallback for fresh navigation
    const name = userProfile?.name ?? route.params?.name ?? t('seeker');
    const lifePath = numerologyResults?.lifePath ?? route.params?.lifePath ?? 0;
    const destiny = numerologyResults?.destiny ?? route.params?.destiny ?? 0;
    const soulUrge = numerologyResults?.soulUrge ?? route.params?.soulUrge ?? 0;
    const personality = numerologyResults?.personality ?? route.params?.personality ?? 0;
    const personalYear = numerologyResults?.personalYear ?? route.params?.personalYear ?? 0;
    const dailyNumber = numerologyResults?.dailyNumber ?? route.params?.dailyNumber ?? 0;


    const [dailyInsight, setDailyInsight] = React.useState<DailyInsightData>(() => ({
        cosmicMessage: t('dailyInsight'),
        energyScore: 50,
        luckyHour: '—',
        luckyColor: '—',
    }));
    const [loadingInsight, setLoadingInsight] = React.useState(true);
    const scrollViewRef = React.useRef<ScrollView>(null);

    React.useEffect(() => {
        if (route.params?.openDailyInsight) {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    }, [route.params?.openDailyInsight]);

    // Request notification permission and schedule daily morning reminder after user is on Home (past splash/onboarding)
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const granted = await requestNotificationPermissions();
                if (granted) {
                    await scheduleDailyMorningReminder();
                }
            } catch (e) {
                // Ignore; permission or scheduling can fail on simulators or if user denies
            }
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        const fetchInsight = async () => {
            const todayKey = new Date().toISOString().split('T')[0];
            const cacheKey = `daily_insight_${lifePath}_${language}_${todayKey}`;

            try {
                // Check cache first
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) {
                    setDailyInsight(parseDailyInsight(cached));
                    setLoadingInsight(false);
                    return;
                }

                // If not cached, fetch from AI
                const insight = await AIService.getDailyInsight(lifePath, language, userProfile?.identity ? { identity: userProfile.identity } : undefined);
                if (insight) {
                    const parsed = parseDailyInsight(insight);
                    setDailyInsight(parsed);
                    await AsyncStorage.setItem(cacheKey, insight);
                }
            } catch (error) {
                console.error('Insight fetch error:', error);
            } finally {
                setLoadingInsight(false);
            }
        };
        fetchInsight();
    }, [lifePath, language]);

    const today = new Date();
    const locale = localeForLanguage[language as keyof typeof localeForLanguage] || 'en-US';
    const formattedDate = today.toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    delaysContentTouches={false}
                >

                    {/* Header Section */}
                    <View style={styles.header}>
                        <MysticalText style={styles.welcomeText}>{t('welcomeBack')}</MysticalText>
                        <MysticalText variant="h1" style={styles.nameText}>{name || t('seeker')}</MysticalText>
                        <MysticalText style={styles.dateText}>{formattedDate}</MysticalText>
                    </View>

                    {/* Cosmic Message Section */}
                    <GlassCard style={styles.cosmicCard}>
                        <View style={styles.cosmicHeader}>
                            <View style={styles.cosmicHeaderLeft}>
                                <Sparkles color={Colors.primary} size={18} />
                                <MysticalText variant="subtitle" style={styles.cosmicTitle}>{t('cosmicMessage')}</MysticalText>
                            </View>
                            <TouchableOpacity
                                style={styles.shareIconBtn}
                                onPress={() => {
                                    const msg = loadingInsight
                                        ? t('consultingStars')
                                        : `${dailyInsight.cosmicMessage}\n\n— ${t('shareDailyMessageCta')}`;
                                    RNShare.share({ message: msg, title: t('cosmicMessage') });
                                }}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Share2 color={Colors.primary} size={20} />
                            </TouchableOpacity>
                        </View>
                        <MysticalText variant="body" style={styles.cosmicContent}>
                            {loadingInsight ? t('consultingStars') : dailyInsight.cosmicMessage}
                        </MysticalText>
                    </GlassCard>

                    {/* View full analysis – show for anyone with stored reading; Pro opens analysis, non-Pro opens paywall */}
                    {hasStoredReading && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onAnalysisCardPress}
                            style={styles.viewAnalysisWrap}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <GlassCard style={styles.viewAnalysisCard}>
                                <View style={styles.oracleIconBox}>
                                    <BookOpen color={Colors.primary} size={24} />
                                </View>
                                <View style={styles.oracleTextContent}>
                                    <MysticalText variant="subtitle" style={styles.oracleTitle}>{t('viewFullAnalysis')}</MysticalText>
                                    <MysticalText variant="caption" style={styles.oracleSub}>
                                        {isPro ? t('viewFullAnalysisSub') : t('unlockFullAnalysis')}
                                    </MysticalText>
                                </View>
                                <ChevronRight color={Colors.textSecondary} size={20} />
                            </GlassCard>
                        </TouchableOpacity>
                    )}

                    {/* YOUR NUMBERS Section */}
                    <View style={styles.section}>
                        <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('yourNumbers')}</MysticalText>
                        <View style={styles.numbersGrid}>
                            <NumberCard
                                value={personalYear}
                                label={t('personalYear')}
                                sub={t('yearTransformation')}
                                color={Colors.secondary}
                            />
                            <NumberCard
                                value={dailyNumber}
                                label={t('dailyNumber')}
                                sub={t('energyToday')}
                                color={Colors.primary}
                            />
                            <NumberCard
                                value={destiny}
                                label={t('destiny')}
                                sub={t('soulPurpose')}
                                color="#3498db"
                            />
                        </View>
                    </View>

                    {/* Daily Stats (Energy, Lucky Hour, Lucky Color) */}
                    <View style={styles.section}>
                        <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('energyToday')}</MysticalText>
                        <GlassCard style={styles.dailyStatsCard}>
                            <View style={styles.dailyStatsRow}>
                                <View style={styles.energyBlock}>
                                    <View style={[styles.energyRing, { borderColor: Colors.primary }]}>
                                        <MysticalText style={[styles.energyScoreText, { color: Colors.primary }]}>
                                            {dailyInsight.energyScore}
                                        </MysticalText>
                                    </View>
                                    <MysticalText variant="caption" style={styles.energyLabel}>{t('energy')}</MysticalText>
                                </View>
                                <View style={styles.luckyBlock}>
                                    <GlassCard style={styles.luckyCard}>
                                        <MysticalText variant="caption" style={styles.luckyLabel}>{t('luckyHour')}</MysticalText>
                                        <MysticalText variant="body" style={styles.luckyValue} numberOfLines={1}>
                                            {dailyInsight.luckyHour || '—'}
                                        </MysticalText>
                                    </GlassCard>
                                    <GlassCard style={styles.luckyCard}>
                                        <MysticalText variant="caption" style={styles.luckyLabel}>{t('luckyColor')}</MysticalText>
                                        <MysticalText variant="body" style={styles.luckyValue} numberOfLines={2}>
                                            {dailyInsight.luckyColor || '—'}
                                        </MysticalText>
                                    </GlassCard>
                                </View>
                            </View>
                        </GlassCard>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const NumberCard = ({ value, label, sub, color }: any) => (
    <GlassCard style={styles.numberCard}>
        <MysticalText style={[styles.numberCardValue, { color, lineHeight: 40 }]}>{value}</MysticalText>
        <MysticalText variant="caption" style={styles.numberCardLabel}>{label}</MysticalText>
        <MysticalText style={styles.numberCardSub}>{sub}</MysticalText>
    </GlassCard>
);

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scrollContent: { padding: 20 },
    header: {
        marginTop: 10,
        marginBottom: 25,
    },
    welcomeText: {
        fontSize: 16,
        opacity: 0.7,
    },
    nameText: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.primary,
        marginVertical: 4,
    },
    dateText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    cosmicCard: {
        padding: 20,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    cosmicHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cosmicHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    shareIconBtn: {
        padding: 4,
    },
    cosmicTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    cosmicContent: {
        fontSize: 16,
        lineHeight: 24,
        fontStyle: 'italic',
        opacity: 0.9,
    },
    viewAnalysisWrap: {
        marginBottom: 20,
    },
    viewAnalysisCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 15,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    section: { marginBottom: 25 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 2,
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    numbersGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    numberCard: {
        width: '31%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    numberCardValue: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 5,
    },
    numberCardLabel: {
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 10,
        marginBottom: 2,
    },
    numberCardSub: {
        fontSize: 8,
        lineHeight: 11,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    dailyStatsCard: {
        padding: 20,
    },
    dailyStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    energyBlock: {
        alignItems: 'center',
    },
    energyRing: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        overflow: 'visible',
    },
    energyScoreText: {
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 32,
    },
    energyLabel: {
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    luckyBlock: {
        flex: 1,
        minWidth: 100,
        gap: 10,
    },
    luckyCard: {
        padding: 12,
        paddingVertical: 10,
        minHeight: 56,
    },
    luckyLabel: {
        color: Colors.textSecondary,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    luckyValue: {
        fontWeight: '600',
        color: Colors.text,
    },
    oracleIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    oracleTextContent: {
        flex: 1,
    },
    oracleTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    oracleSub: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});
