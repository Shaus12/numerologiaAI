import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Share as RNShare, Modal, Animated, Dimensions, Pressable, LayoutChangeEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { Sparkles, ChevronRight, BookOpen, Share2, Lock, Briefcase, Heart, Zap, MessageCircle, Users, LayoutGrid, Phone, Home, Type, Calendar, Info, X, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AIService } from '../../services/ai';
import { useSettings } from '../../context/SettingsContext';
import { useUser } from '../../context/UserContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { localeForLanguage } from '../../utils/translations';
import { useFocusEffect } from '@react-navigation/native';
import {
    requestNotificationPermissions,
    scheduleDailyMorningReminder,
    scheduleDailyMorningReminderIfGranted,
} from '../../utils/notifications';
import {
    buildLifePathFallbackInsight,
    loadTodayOracleInsight,
    saveTodayOracleInsight,
} from '../../utils/dailyOracleStorage';

/** Only show the OS notification prompt once, on the user's first visit to Home (e.g. after analysis → MainTabs). */
const NOTIFICATION_FIRST_HOME_PROMPT_KEY = 'notification_first_home_prompt_v1';
import { dailyNumberForGuide } from '../../data/dailyActionGuide';

export type DailyInsightData = {
    cosmicMessage: string;
    energyScore: number;
    luckyHour: string;
    luckyColor: string;
};

export type DailyActionGuideData = {
    dailyNumber: number;
    theme: string;
    career: string;
    relationships: string;
    action: string;
};

function extractJsonString(raw: string): string {
    let s = raw.trim();
    // Strip markdown code fences (e.g. ```json ... ``` or ``` ... ```)
    const codeFence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/;
    const match = s.match(codeFence);
    if (match) s = match[1].trim();
    return s;
}

function parseDailyActionGuide(raw: string): DailyActionGuideData | null {
    if (!raw) return null;
    const toParse = extractJsonString(raw);
    try {
        const parsed = JSON.parse(toParse) as Record<string, unknown>;
        if (
            typeof parsed.theme === 'string' &&
            typeof parsed.career === 'string' &&
            typeof parsed.relationships === 'string' &&
            typeof parsed.action === 'string'
        ) {
            return {
                dailyNumber: typeof parsed.dailyNumber === 'number' ? parsed.dailyNumber : 0,
                theme: parsed.theme.trim(),
                career: parsed.career.trim(),
                relationships: parsed.relationships.trim(),
                action: parsed.action.trim(),
            };
        }
        return null;
    } catch {
        return null;
    }
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
        <View style={[styles.mapNode, { transform: [{ translateX: x }, { translateY: y }] }]}>
            <View style={[styles.mapNodeCircle, { borderColor: color }]}>
                <MysticalText style={[styles.mapNodeValue, { color }]}>{value}</MysticalText>
            </View>
            <MysticalText variant="caption" style={styles.mapNodeLabel}>{label}</MysticalText>
        </View>
    );
};

const ConnectionLine = ({ angle }: { angle: number }) => (
    <View
        style={[
            styles.mapLine,
            {
                transform: [{ rotate: `${angle}deg` }, { translateX: 35 }],
            },
        ]}
    >
        <View style={styles.mapLineGlow} />
    </View>
);

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
    const { language, t } = useSettings();
    const { userProfile, numerologyResults } = useUser();
    const { isPro } = useRevenueCat();

    const hasStoredReading = Boolean(numerologyResults?.reading?.trim());
    const parentNav = navigation.getParent() as any;

    // ── Walkthrough ──────────────────────────────────────────────────────────
    const WALKTHROUGH_KEY = 'home_walkthrough_v2';
    const [walkthroughStep, setWalkthroughStep] = React.useState(0);
    const [guideCardY, setGuideCardY] = React.useState(0);
    const pulseAnim = React.useRef(new Animated.Value(1)).current;
    const guideGlowAnim = React.useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();
    const SCREEN_W = Dimensions.get('window').width;

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
    const moonSpin = React.useRef(new Animated.Value(0)).current;

    const [dailyGuide, setDailyGuide] = React.useState<DailyActionGuideData | null>(null);
    const [loadingGuide, setLoadingGuide] = React.useState(true);
    const scrollViewRef = React.useRef<ScrollView>(null);
    const [showToolkitInfo, setShowToolkitInfo] = React.useState(false);

    React.useEffect(() => {
        if (route.params?.openDailyInsight) {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    }, [route.params?.openDailyInsight]);

    // First visit to Home only: OS notification prompt (typically right after analysis → dashboard).
    // Later visits / language changes: reschedule reminder only if permission already granted.
    React.useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(async () => {
            try {
                if (cancelled) return;

                // Paying subscribers use the 08:30 subscriber-journey stack only — never reschedule generic 08:00 here.
                if (isPro) {
                    const prompted = await AsyncStorage.getItem(NOTIFICATION_FIRST_HOME_PROMPT_KEY);
                    if (prompted !== '1' && !cancelled) {
                        await AsyncStorage.setItem(NOTIFICATION_FIRST_HOME_PROMPT_KEY, '1');
                    }
                    return;
                }

                const alreadyPrompted = await AsyncStorage.getItem(NOTIFICATION_FIRST_HOME_PROMPT_KEY);
                if (cancelled) return;
                if (alreadyPrompted === '1') {
                    await scheduleDailyMorningReminderIfGranted(language);
                    return;
                }
                const granted = await requestNotificationPermissions();
                if (!cancelled) {
                    await AsyncStorage.setItem(NOTIFICATION_FIRST_HOME_PROMPT_KEY, '1');
                }
                if (granted && !cancelled) {
                    await scheduleDailyMorningReminder(language);
                }
            } catch {
                try {
                    await AsyncStorage.setItem(NOTIFICATION_FIRST_HOME_PROMPT_KEY, '1');
                } catch (_) {}
            }
        }, 1800);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [language, isPro]);

    React.useEffect(() => {
        AsyncStorage.getItem(WALKTHROUGH_KEY)
            .then(done => { if (!done) setTimeout(() => setWalkthroughStep(1), 900); })
            .catch(() => {});
    }, []);

    React.useEffect(() => {
        if (walkthroughStep === 2 || walkthroughStep === 3) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.45, duration: 750, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.stopAnimation?.();
            pulseAnim.setValue(1);
        }
    }, [walkthroughStep]);

    React.useEffect(() => {
        if (walkthroughStep === 1) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(guideGlowAnim, { toValue: 1, duration: 850, useNativeDriver: true }),
                    Animated.timing(guideGlowAnim, { toValue: 0.2, duration: 850, useNativeDriver: true }),
                ])
            ).start();
        } else {
            guideGlowAnim.stopAnimation?.();
            guideGlowAnim.setValue(0);
        }
    }, [walkthroughStep, guideGlowAnim]);

    /** Scroll Daily Action Guide into view when step 1 opens */
    React.useEffect(() => {
        if (walkthroughStep !== 1) return;
        const scrollToGuide = () => {
            const y = guideCardY > 0 ? Math.max(0, guideCardY - 12) : 260;
            scrollViewRef.current?.scrollTo({ y, animated: true });
        };
        const t1 = setTimeout(scrollToGuide, 400);
        const t2 = setTimeout(scrollToGuide, 1100);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [walkthroughStep, guideCardY]);

    const onGuideCardLayout = React.useCallback((e: LayoutChangeEvent) => {
        setGuideCardY(e.nativeEvent.layout.y);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            let active = true;
            setLoadingInsight(true);

            const runMoonSpinner = Animated.loop(
                Animated.timing(moonSpin, {
                    toValue: 1,
                    duration: 3200,
                    useNativeDriver: true,
                }),
            );
            moonSpin.setValue(0);
            runMoonSpinner.start();

            const fetchInsight = async () => {
                try {
                    const focusArea = userProfile?.focus ?? '';

                    const cached = await loadTodayOracleInsight({
                        lifePath,
                        language,
                        focusArea,
                    });
                    if (cached?.cosmicMessage) {
                        if (!active) return;
                        setDailyInsight(cached);
                        setLoadingInsight(false);
                        return;
                    }

                    const live = await AIService.getDailyInsight(
                        lifePath,
                        language,
                        {
                            identity: userProfile?.identity,
                            focus: focusArea,
                        },
                    );

                    if (live) {
                        const parsed = parseDailyInsight(live);
                        if (parsed.cosmicMessage) {
                            await saveTodayOracleInsight(
                                { lifePath, language, focusArea },
                                parsed,
                                'ai',
                            );
                            if (!active) return;
                            setDailyInsight(parsed);
                            setLoadingInsight(false);
                            return;
                        }
                    }

                    const hardFallback = buildLifePathFallbackInsight(lifePath, focusArea);
                    await saveTodayOracleInsight(
                        { lifePath, language, focusArea },
                        hardFallback,
                        'life-path-fallback',
                    );
                    if (!active) return;
                    setDailyInsight(hardFallback);
                } catch (error) {
                    console.error('Daily Oracle fallback error:', error);
                    const hardFallback = buildLifePathFallbackInsight(lifePath, userProfile?.focus);
                    try {
                        await saveTodayOracleInsight(
                            { lifePath, language, focusArea: userProfile?.focus },
                            hardFallback,
                            'life-path-fallback',
                        );
                    } catch {
                        // noop: best-effort cache write
                    }
                    if (!active) return;
                    setDailyInsight(hardFallback);
                } finally {
                    if (!active) return;
                    setLoadingInsight(false);
                }
            };

            fetchInsight();

            return () => {
                active = false;
                runMoonSpinner.stop();
                moonSpin.stopAnimation();
            };
        }, [lifePath, language, moonSpin, userProfile?.focus, userProfile?.identity]),
    );

    React.useEffect(() => {
        if (!userProfile?.birthdate) {
            setLoadingGuide(false);
            return;
        }
        const fetchGuide = async () => {
            const todayKey = new Date().toISOString().split('T')[0];
            const cacheKey = `daily_action_guide_${userProfile.birthdate}_${language}_${todayKey}`;
            try {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) {
                    setDailyGuide(parseDailyActionGuide(cached));
                    setLoadingGuide(false);
                    return;
                }
                const raw = await AIService.getDailyActionGuide(
                    userProfile.birthdate,
                    language,
                    userProfile?.identity ? { identity: userProfile.identity } : undefined,
                );
                if (raw) {
                    const parsed = parseDailyActionGuide(raw);
                    setDailyGuide(parsed);
                    await AsyncStorage.setItem(cacheKey, raw);
                }
            } catch (error) {
                console.error('Daily guide fetch error:', error);
            } finally {
                setLoadingGuide(false);
            }
        };
        fetchGuide();
    }, [userProfile?.birthdate, language]);

    const dismissWalkthrough = () => {
        setWalkthroughStep(0);
        AsyncStorage.setItem(WALKTHROUGH_KEY, 'true').catch(() => {});
    };
    const advanceWalkthrough = () => setWalkthroughStep((s) => (s < 3 ? s + 1 : s));

    const today = new Date();
    const locale = localeForLanguage[language as keyof typeof localeForLanguage] || 'en-US';
    const formattedDate = today.toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
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
                            {loadingInsight ? '' : dailyInsight.cosmicMessage}
                        </MysticalText>
                        {loadingInsight && (
                            <View style={styles.oracleLoadingWrap}>
                                <Animated.View
                                    style={{
                                        transform: [
                                            {
                                                rotate: moonSpin.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0deg', '360deg'],
                                                }),
                                            },
                                        ],
                                    }}
                                >
                                    <Moon color={Colors.primary} size={24} />
                                </Animated.View>
                                <MysticalText style={styles.oracleLoadingText}>
                                    האורקל מתחבר לאנרגיה שלך...
                                </MysticalText>
                            </View>
                        )}
                    </GlassCard>

                    {/* Daily Action Guide – full for Pro, teaser for free */}
                    {(() => {
                        const openPaywall = () => parentNav?.navigate('Paywall');
                        const guideDisplayNumber = dailyGuide?.dailyNumber ?? dailyNumberForGuide(dailyNumber);
                        const theme = loadingGuide ? '…' : (dailyGuide?.theme ?? '…');
                        const career = loadingGuide ? t('consultingStars') : (dailyGuide?.career ?? '');
                        const relationships = loadingGuide ? '' : (dailyGuide?.relationships ?? '');
                        const action = loadingGuide ? '' : (dailyGuide?.action ?? '');

                        const VaultCtaInGuide = () => (
                            <TouchableOpacity
                                style={[styles.ctaBanner, styles.ctaInGuide]}
                                onPress={() => navigation.navigate('Vault')}
                                activeOpacity={0.75}
                            >
                                <View style={[styles.ctaIconCircle, { backgroundColor: 'rgba(52,211,153,0.15)' }]}>
                                    <Users color="#34d399" size={18} />
                                </View>
                                <View style={styles.ctaBody}>
                                    <MysticalText style={styles.ctaQuestion}>{t('ctaVaultQuestion')}</MysticalText>
                                    <MysticalText style={[styles.ctaAction, { color: '#34d399' }]}>{t('ctaVaultAction')} →</MysticalText>
                                </View>
                                <ChevronRight color="rgba(255,255,255,0.2)" size={16} />
                            </TouchableOpacity>
                        );

                        const OracleCtaInGuide = () => (
                            <TouchableOpacity
                                style={[styles.ctaBanner, styles.ctaInGuide, styles.ctaInGuideLast]}
                                onPress={() => navigation.navigate('Oracle', { lifePath, language })}
                                activeOpacity={0.75}
                            >
                                <View style={[styles.ctaIconCircle, { backgroundColor: 'rgba(155,89,182,0.18)' }]}>
                                    <MessageCircle color={Colors.secondary} size={18} />
                                </View>
                                <View style={styles.ctaBody}>
                                    <MysticalText style={styles.ctaQuestion}>{t('ctaOracleQuestion')}</MysticalText>
                                    <MysticalText style={[styles.ctaAction, { color: Colors.secondary }]}>{t('ctaOracleAction')} →</MysticalText>
                                </View>
                                <ChevronRight color="rgba(255,255,255,0.2)" size={16} />
                            </TouchableOpacity>
                        );

                        const GuideBody = ({ embedCtas }: { embedCtas: boolean }) => (
                            <>
                                {/* Career */}
                                <View style={styles.guideSection}>
                                    <View style={[styles.guideSectionIcon, { backgroundColor: 'rgba(155,89,182,0.15)' }]}>
                                        <Briefcase color={Colors.secondary} size={18} />
                                    </View>
                                    <View style={styles.guideSectionBody}>
                                        <MysticalText style={styles.guideSectionLabel}>{t('dailyActionGuideCareer')}</MysticalText>
                                        <MysticalText style={styles.guideSectionText}>{career}</MysticalText>
                                    </View>
                                </View>

                                <View style={styles.guideSectionDivider} />

                                {/* Relationships */}
                                <View style={styles.guideSection}>
                                    <View style={[styles.guideSectionIcon, { backgroundColor: 'rgba(231,76,60,0.12)' }]}>
                                        <Heart color="#e74c3c" size={18} />
                                    </View>
                                    <View style={styles.guideSectionBody}>
                                        <MysticalText style={styles.guideSectionLabel}>{t('dailyActionGuideRelationships')}</MysticalText>
                                        <MysticalText style={styles.guideSectionText}>{relationships}</MysticalText>
                                    </View>
                                </View>

                                {embedCtas && <VaultCtaInGuide />}

                                {/* Today's Action – gold highlight */}
                                <View style={styles.guideActionBlock}>
                                    <View style={styles.guideActionHeader}>
                                        <Zap color={Colors.primary} size={13} />
                                        <MysticalText style={styles.guideActionLabel}>{t('dailyActionGuideAction')}</MysticalText>
                                    </View>
                                    <MysticalText style={styles.guideActionText}>{action}</MysticalText>
                                </View>

                                {embedCtas && <OracleCtaInGuide />}
                            </>
                        );

                        return (
                            <View style={styles.guideCardOuter} onLayout={onGuideCardLayout} collapsable={false}>
                            <View style={[styles.guideCard, walkthroughStep === 1 && styles.guideCardHighlight]}>
                                {/* Card header: number circle + title + theme */}
                                <View style={styles.guideCardHeader}>
                                    <View style={styles.guideNumberCircle}>
                                        <MysticalText style={styles.guideNumberText}>{guideDisplayNumber}</MysticalText>
                                    </View>
                                    <View style={styles.guideHeaderMeta}>
                                        <MysticalText style={styles.guideCardTitle}>{t('dailyActionGuide')}</MysticalText>
                                        <MysticalText style={styles.guideTheme} numberOfLines={2}>{theme}</MysticalText>
                                    </View>
                                </View>

                                <View style={styles.guideHeaderDivider} />

                                {isPro ? (
                                    <GuideBody embedCtas />
                                ) : (
                                    <>
                                        <TouchableOpacity onPress={openPaywall} activeOpacity={1}>
                                            <View style={styles.guideTeaserContent} pointerEvents="none">
                                                <GuideBody embedCtas={false} />
                                            </View>
                                            <LinearGradient
                                                colors={['rgba(10,6,18,0)', 'rgba(10,6,18,0.82)', 'rgba(10,6,18,0.97)']}
                                                style={styles.guideTeaserGradient}
                                                pointerEvents="none"
                                            />
                                            <View style={styles.guideTeaserCta} pointerEvents="none">
                                                <Lock color={Colors.primary} size={24} />
                                                <MysticalText style={styles.guideTeaserText}>{t('dailyGuideUnlockCta')}</MysticalText>
                                            </View>
                                        </TouchableOpacity>
                                        {/* Tappable CTAs outside paywall overlay (same order as Pro) */}
                                        <VaultCtaInGuide />
                                        <OracleCtaInGuide />
                                    </>
                                )}
                                <MysticalText style={styles.guideFooterHint}>
                                    {t('dailyActionGuideComeBackTomorrow')}
                                </MysticalText>
                            </View>
                            {walkthroughStep === 1 && (
                                <Animated.View
                                    style={[StyleSheet.absoluteFill, styles.guideCardGlowRing, { opacity: guideGlowAnim }]}
                                    pointerEvents="none"
                                />
                            )}
                            </View>
                        );
                    })()}

                    {/* Cosmic Toolkit Section */}
                    <View style={styles.section}>
                        <View style={styles.toolkitHeader}>
                            <MysticalText variant="subtitle" style={[styles.sectionTitle, { marginBottom: 0 }]}>{t('toolkitTitle') || 'Cosmic Toolkit'}</MysticalText>
                            <TouchableOpacity onPress={() => setShowToolkitInfo(true)} hitSlop={10} style={styles.infoBtn}>
                                <Info color={Colors.textSecondary} size={16} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolkitScroll}>
                            <TouchableOpacity style={styles.toolkitCard} onPress={() => (navigation as any).navigate('PhoneNumberEnergy')}>
                                <View style={styles.toolkitIconBox}>
                                    <Phone color={Colors.primary} size={24} />
                                </View>
                                <MysticalText style={styles.toolkitCardTitle}>{t('toolkitCardPhoneTitle') || 'Phone Number'}</MysticalText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toolkitCard} onPress={() => (navigation as any).navigate('HomeEnergy')}>
                                <View style={styles.toolkitIconBox}>
                                    <Home color={Colors.primary} size={24} />
                                </View>
                                <MysticalText style={styles.toolkitCardTitle}>{t('toolkitCardHomeTitle') || 'Home Energy'}</MysticalText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toolkitCard} onPress={() => (navigation as any).navigate('NameEnergy')}>
                                <View style={styles.toolkitIconBox}>
                                    <Type color={Colors.primary} size={24} />
                                </View>
                                <MysticalText style={styles.toolkitCardTitle}>{t('toolkitCardNamesTitle') || 'Name Energy'}</MysticalText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toolkitCard} onPress={() => (navigation as any).navigate('DateEnergy')}>
                                <View style={styles.toolkitIconBox}>
                                    <Calendar color={Colors.primary} size={24} />
                                </View>
                                <MysticalText style={styles.toolkitCardTitle}>{t('toolkitCardDatesTitle') || 'Important Dates'}</MysticalText>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

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

                    {/* Numerology Map – diagram (after View full analysis, before Your numbers) */}
                    {(lifePath > 0 || destiny > 0 || soulUrge > 0 || personality > 0) && (
                        <View style={styles.mapSection}>
                            <MysticalText variant="subtitle" style={styles.mapSectionTitle}>{t('numerologyMap')}</MysticalText>
                            <View style={styles.mapContainer}>
                                <View style={styles.mapGraphic}>
                                    <View style={styles.mapCoreNode}>
                                        <View style={[styles.mapNodeCircle, styles.mapCoreCircle]}>
                                            <MysticalText style={[styles.mapCoreValue, { lineHeight: 40 }]}>{lifePath}</MysticalText>
                                        </View>
                                        <MysticalText variant="caption" style={styles.mapNodeLabel}>{t('core')}</MysticalText>
                                    </View>
                                    <MapNode label={t('destiny')} value={destiny} angle={-90} color={Colors.secondary} />
                                    <MapNode label={t('soulUrge')} value={soulUrge} angle={30} color="#3498db" />
                                    <MapNode label={t('personality')} value={personality} angle={150} color="#e74c3c" />
                                    <ConnectionLine angle={-90} />
                                    <ConnectionLine angle={30} />
                                    <ConnectionLine angle={150} />
                                </View>
                                <View style={styles.mapLegend}>
                                    <View style={styles.mapLegendItem}>
                                        <View style={[styles.mapDot, { backgroundColor: Colors.secondary }]} />
                                        <MysticalText variant="caption" style={styles.mapLegendText}>{t('destiny')}: {destiny}</MysticalText>
                                    </View>
                                    <View style={styles.mapLegendItem}>
                                        <View style={[styles.mapDot, { backgroundColor: '#3498db' }]} />
                                        <MysticalText variant="caption" style={styles.mapLegendText}>{t('soulUrge')}: {soulUrge}</MysticalText>
                                    </View>
                                    <View style={styles.mapLegendItem}>
                                        <View style={[styles.mapDot, { backgroundColor: '#e74c3c' }]} />
                                        <MysticalText variant="caption" style={styles.mapLegendText}>{t('personality')}: {personality}</MysticalText>
                                    </View>
                                </View>
                            </View>
                        </View>
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

        {/* ── Three-step Walkthrough Overlay ── */}
        <Modal
            visible={walkthroughStep > 0}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={[styles.wtBackdrop, walkthroughStep === 1 && styles.wtBackdropLight]}>
                {/* Skip */}
                <Pressable
                    style={[styles.wtSkipBtn, { top: insets.top + 14 }]}
                    onPress={dismissWalkthrough}
                    hitSlop={14}
                >
                    <MysticalText style={styles.wtSkipText}>{t('walkthroughSkip')}</MysticalText>
                </Pressable>

                {/* Step 1 — Daily Action Guide (scroll + lighter veil so card reads clearly) */}
                {walkthroughStep === 1 && (
                    <View style={[styles.wtStep1TopWrap, { paddingTop: insets.top + 52 }]}>
                        <View style={styles.wtCard}>
                            <View style={styles.wtDots}>
                                <View style={[styles.wtDot, styles.wtDotActive]} />
                                <View style={styles.wtDot} />
                                <View style={styles.wtDot} />
                            </View>
                            <View style={[styles.wtIconCircle, { backgroundColor: 'rgba(155,89,182,0.18)' }]}>
                                <Zap color={Colors.secondary} size={26} />
                            </View>
                            <MysticalText variant="h2" style={styles.wtTitle}>{t('walkthroughStep1Title')}</MysticalText>
                            <MysticalText style={styles.wtBody}>{t('walkthroughStep1Body')}</MysticalText>
                            <View style={styles.wtBtnRow}>
                                <Pressable style={styles.wtNextBtn} onPress={advanceWalkthrough} hitSlop={8}>
                                    <MysticalText style={styles.wtNextText}>{t('walkthroughNext')} →</MysticalText>
                                </Pressable>
                            </View>
                        </View>
                        <View style={styles.wtArrowDown} />
                    </View>
                )}

                {/* Step 2 — Oracle tab */}
                {walkthroughStep === 2 && (
                    <>
                        <Animated.View
                            style={[
                                styles.wtOraclePulse,
                                {
                                    left: SCREEN_W * 0.3 - 28,
                                    bottom: insets.bottom + 4,
                                    transform: [{ scale: pulseAnim }],
                                },
                            ]}
                        />
                        <View style={[styles.wtStep2Wrapper, { bottom: insets.bottom + 84 }]}>
                            <View style={styles.wtCard}>
                                <View style={styles.wtDots}>
                                    <View style={styles.wtDot} />
                                    <View style={[styles.wtDot, styles.wtDotActive]} />
                                    <View style={styles.wtDot} />
                                </View>
                                <View style={[styles.wtIconCircle, { backgroundColor: 'rgba(155,89,182,0.15)' }]}>
                                    <MessageCircle color="#9b59b6" size={26} />
                                </View>
                                <MysticalText variant="h2" style={styles.wtTitle}>{t('walkthroughStep2Title')}</MysticalText>
                                <MysticalText style={styles.wtBody}>{t('walkthroughStep2Body')}</MysticalText>
                                <View style={styles.wtBtnRow}>
                                    <Pressable style={styles.wtNextBtn} onPress={advanceWalkthrough} hitSlop={8}>
                                        <MysticalText style={styles.wtNextText}>{t('walkthroughNext')} →</MysticalText>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.wtArrowDown} />
                        </View>
                    </>
                )}

                {/* Step 3 — Vault tab */}
                {walkthroughStep === 3 && (
                    <>
                        <Animated.View
                            style={[
                                styles.wtVaultPulse,
                                {
                                    left: SCREEN_W * 0.5 - 28,
                                    bottom: insets.bottom + 4,
                                    transform: [{ scale: pulseAnim }],
                                },
                            ]}
                        />
                        <View style={[styles.wtStep2Wrapper, { bottom: insets.bottom + 84 }]}>
                            <View style={styles.wtCard}>
                                <View style={styles.wtDots}>
                                    <View style={styles.wtDot} />
                                    <View style={styles.wtDot} />
                                    <View style={[styles.wtDot, styles.wtDotActive]} />
                                </View>
                                <View style={[styles.wtIconCircle, { backgroundColor: 'rgba(52,211,153,0.15)' }]}>
                                    <Users color="#34d399" size={26} />
                                </View>
                                <MysticalText variant="h2" style={styles.wtTitle}>{t('walkthroughStep3Title')}</MysticalText>
                                <MysticalText style={styles.wtBody}>{t('walkthroughStep3Body')}</MysticalText>
                                <Pressable style={styles.wtDoneBtn} onPress={dismissWalkthrough} hitSlop={8}>
                                    <MysticalText style={styles.wtNextText}>{t('walkthroughDone')}</MysticalText>
                                </Pressable>
                            </View>
                            <View style={styles.wtArrowDown} />
                        </View>
                    </>
                )}
            </View>
        </Modal>

        {/* ── Toolkit Info Modal ── */}
        <Modal
            visible={showToolkitInfo}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => setShowToolkitInfo(false)}
        >
            <View style={[styles.wtBackdrop, { justifyContent: 'center', paddingHorizontal: 24 }]}>
                <View style={styles.wtCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <MysticalText variant="h2" style={styles.wtTitle}>{t('toolkitTitle') || 'Numerology Toolkit'}</MysticalText>
                        <TouchableOpacity onPress={() => setShowToolkitInfo(false)} hitSlop={10}>
                            <X color={Colors.textSecondary} size={24} />
                        </TouchableOpacity>
                    </View>
                    <MysticalText style={styles.wtBody}>
                        {t('toolkitExplanation') || 'Quick tools to read the energy of numbers, names, and dates.'}
                    </MysticalText>
                    <Pressable style={[styles.wtDoneBtn, { marginTop: 16 }]} onPress={() => setShowToolkitInfo(false)}>
                        <MysticalText style={styles.wtNextText}>{t('continue') || 'Continue'}</MysticalText>
                    </Pressable>
                </View>
            </View>
        </Modal>
        </>
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
    oracleLoadingWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 8,
    },
    oracleLoadingText: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    // Daily Action Guide — redesigned
    guideCardOuter: {
        marginBottom: 24,
        borderRadius: 20,
    },
    guideCard: {
        backgroundColor: 'rgba(155,89,182,0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(155,89,182,0.22)',
        overflow: 'hidden',
    },
    guideCardHighlight: {
        borderColor: Colors.secondary,
        borderWidth: 2,
    },
    guideCardGlowRing: {
        borderRadius: 20,
        borderWidth: 3,
        borderColor: Colors.secondary,
    },
    guideCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        paddingBottom: 14,
    },
    guideNumberCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(155,89,182,0.2)',
        borderWidth: 1.5,
        borderColor: 'rgba(155,89,182,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    guideNumberText: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.secondary,
        lineHeight: 28,
    },
    guideHeaderMeta: {
        flex: 1,
    },
    guideCardTitle: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: Colors.secondary,
        marginBottom: 4,
        opacity: 0.8,
    },
    guideTheme: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
        lineHeight: 20,
    },
    guideHeaderDivider: {
        height: 1,
        backgroundColor: 'rgba(155,89,182,0.15)',
        marginHorizontal: 16,
        marginBottom: 4,
    },
    guideSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    guideSectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 1,
    },
    guideSectionBody: {
        flex: 1,
    },
    guideSectionLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    guideSectionText: {
        fontSize: 14,
        lineHeight: 22,
        color: 'rgba(255,255,255,0.88)',
    },
    guideSectionDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 16,
    },
    guideActionBlock: {
        marginHorizontal: 12,
        marginTop: 10,
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'rgba(212,175,55,0.12)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.32)',
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 12,
        elevation: 4,
    },
    guideActionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    guideActionLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.6,
        textTransform: 'uppercase',
        color: Colors.primary,
    },
    guideActionText: {
        fontSize: 15,
        lineHeight: 24,
        fontWeight: '700',
        color: Colors.text,
    },
    guideFooterHint: {
        fontSize: 12,
        lineHeight: 17,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 16,
        opacity: 0.75,
    },
    // Teaser (free users)
    guideTeaserContent: {
        opacity: 0.45,
    },
    guideTeaserGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 160,
    },
    guideTeaserCta: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 8,
    },
    guideTeaserText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 15,
        textAlign: 'center',
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
    mapSection: {
        marginBottom: 25,
    },
    mapSectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 2,
        marginBottom: 15,
        textTransform: 'uppercase',
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
    mapCoreNode: {
        zIndex: 10,
        alignItems: 'center',
    },
    mapNodeCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapCoreCircle: {
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
    mapCoreValue: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.primary,
    },
    mapNode: {
        position: 'absolute',
        alignItems: 'center',
    },
    mapNodeValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    mapNodeLabel: {
        marginTop: 4,
        fontSize: 9,
    },
    mapLine: {
        position: 'absolute',
        width: 40,
        height: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapLineGlow: {
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
    mapLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    mapLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mapDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    mapLegendText: {
        fontSize: 10,
        color: Colors.textSecondary,
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
    toolkitScroll: {
        gap: 16,
        paddingRight: 20,
    },
    toolkitHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingRight: 5,
    },
    infoBtn: {
        padding: 4,
    },
    toolkitCard: {
        width: 140,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        alignItems: 'center',
        gap: 12,
    },
    toolkitIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolkitCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
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
    // CTA banners
    ctaBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    ctaBannerLast: {
        marginBottom: 8,
    },
    /** CTAs nested inside Daily Action Guide card */
    ctaInGuide: {
        marginHorizontal: 12,
        marginBottom: 10,
    },
    ctaInGuideLast: {
        marginBottom: 14,
    },
    ctaIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    ctaBody: {
        flex: 1,
        gap: 2,
    },
    ctaQuestion: {
        fontSize: 12,
        color: Colors.textSecondary,
        lineHeight: 16,
    },
    ctaAction: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.2,
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
    // ── Walkthrough overlay ───────────────────────────────────────────────
    wtBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(5,0,20,0.88)',
    },
    wtBackdropLight: {
        backgroundColor: 'rgba(5,0,20,0.55)',
    },
    wtSkipBtn: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
    },
    wtSkipText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },
    wtStep1TopWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        alignItems: 'center',
        zIndex: 2,
    },
    wtStep2Wrapper: {
        position: 'absolute',
        left: 24,
        right: 24,
        alignItems: 'center',
    },
    wtCard: {
        width: '100%',
        backgroundColor: '#0f0820',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.3)',
        padding: 24,
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 12,
    },
    wtDots: {
        flexDirection: 'row',
        gap: 6,
    },
    wtDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    wtDotActive: {
        width: 18,
        backgroundColor: '#d4af37',
    },
    wtIconCircle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wtTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.primary,
    },
    wtBody: {
        fontSize: 14,
        lineHeight: 22,
        color: 'rgba(255,255,255,0.72)',
    },
    wtBtnRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 2,
    },
    wtNextBtn: {
        backgroundColor: 'rgba(212,175,55,0.12)',
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: 22,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.3)',
    },
    wtDoneBtn: {
        backgroundColor: 'rgba(212,175,55,0.12)',
        borderRadius: 12,
        paddingVertical: 11,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.3)',
        alignItems: 'center',
        marginTop: 2,
    },
    wtNextText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#d4af37',
    },
    wtArrowDown: {
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderTopWidth: 16,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#0f0820',
        alignSelf: 'center',
        marginTop: -1,
    },
    wtOraclePulse: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2.5,
        borderColor: '#9b59b6',
        backgroundColor: 'rgba(155,89,182,0.15)',
    },
    wtVaultPulse: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2.5,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.12)',
    },
});
