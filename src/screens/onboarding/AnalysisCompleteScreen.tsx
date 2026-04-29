import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    BackHandler,
    Share as RNShare,
    Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import {
    Sparkles, Share2,
    Star, Heart, User, CalendarDays,
    MessageCircle, Zap, Users, LayoutGrid,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

/** Paragraphs shown in the non-pro teaser (fixed-height clipped container) */
const TEASER_PARAS = 2;
/** Fixed pixel height of the non-pro teaser container */
const TEASER_HEIGHT = 200;
/** Paragraphs shown before the "Read full reading" toggle for pro users */
const COLLAPSED_PARA_COUNT = 1;

type Props = NativeStackScreenProps<RootStackParamList, 'AnalysisComplete'>;

// ---------- small stat card ----------
interface StatCardProps {
    icon: React.ReactNode;
    value: number | string;
    label: string;
    accent?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accent }) => (
    <View style={[statStyles.card, accent && statStyles.cardAccent]}>
        <View style={statStyles.iconWrap}>{icon}</View>
        <MysticalText style={statStyles.value}>{value}</MysticalText>
        <MysticalText style={statStyles.label} numberOfLines={1}>{label}</MysticalText>
    </View>
);

const statStyles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    cardAccent: {
        borderColor: 'rgba(212,175,55,0.25)',
        backgroundColor: 'rgba(212,175,55,0.06)',
    },
    iconWrap: {
        marginBottom: 8,
        opacity: 0.7,
    },
    value: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.primary,
        lineHeight: 30,
    },
    label: {
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginTop: 4,
        textAlign: 'center',
    },
});

// ---------- main screen ----------
export const AnalysisCompleteScreen: React.FC<Props> = ({ route, navigation }) => {
    const { t } = useSettings();
    const posthog = usePostHog();
    const { isPro } = useRevenueCat();
    const insets = useSafeAreaInsets();
    const results = route.params || {};

    const [readingExpanded, setReadingExpanded] = useState(false);

    const fullReading = results.reading || 'Your celestial path is being revealed…';
    const paragraphs = fullReading.split('\n\n').map((p: string) => p.trim()).filter(Boolean);

    // Pulse animation for the hero ring
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in content
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        // Soft pulse on the outer ring
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.14, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        return () => {
            pulseAnim.stopAnimation();
        };
    }, []);

    const tabParams = useMemo(
        () => (route.params ?? {}) as RootStackParamList['MainTabs'],
        [route.params]
    );

    const goToHome = useCallback(() => {
        if (posthog) posthog.capture('onboarding_completed');
        navigation.replace('MainTabs', tabParams);
    }, [navigation, posthog, tabParams]);

    useEffect(() => {
        const onHardwareBack = () => {
            if (isPro) {
                goToHome();
                return true;
            }
            return true;
        };
        const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
        return () => sub.remove();
    }, [isPro, goToHome]);

    const handleShare = async () => {
        try {
            const snippet = paragraphs[0] || '';
            const message = snippet
                ? `${snippet}\n\n— My Life Path: ${results.lifePath}. From my full numerology analysis in Echoes: Numerology Map. Discover yours!`
                : `I just discovered my Life Path is ${results.lifePath}! Unlock your own detailed numerology report with Echoes: Numerology Map.`;
            await RNShare.share({ message, title: t('shareResult') });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    // Teaser paragraphs: first N paragraphs shown under the dark fade
    const teaserParas = paragraphs.slice(0, TEASER_PARAS);

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        isPro && { paddingBottom: 108 + Math.max(insets.bottom, 16) },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    delaysContentTouches={false}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>

                        {/* ── HERO ── */}
                        <View style={styles.hero}>
                            <MysticalText style={styles.heroLifePathCallout}>
                                {t('analysisHeroLifePathLabel')}
                            </MysticalText>
                            <View style={styles.heroRingStack}>
                                <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
                                <LinearGradient
                                    colors={['#2a1a00', '#1a0e00']}
                                    style={styles.heroCircle}
                                >
                                    <MysticalText style={styles.heroCircleKicker}>{t('lifePath')}</MysticalText>
                                    <MysticalText style={styles.heroNumber}>{results.lifePath}</MysticalText>
                                </LinearGradient>
                            </View>

                            <MysticalText variant="h1" style={styles.heroTitle}>
                                {t('analysisComplete')}
                            </MysticalText>
                            <MysticalText variant="subtitle" style={styles.heroSubtitle}>
                                {t('blueprintReady')}
                            </MysticalText>
                        </View>

                        {/* ── STATS GRID (only after unlock) ── */}
                        {isPro && (
                            <View style={styles.statsSection}>
                                <View style={styles.statsRow}>
                                    <StatCard
                                        icon={<Star color={Colors.primary} size={18} />}
                                        value={results.destiny}
                                        label={t('destiny')}
                                    />
                                    <View style={styles.statGap} />
                                    <StatCard
                                        icon={<Heart color={Colors.primary} size={18} />}
                                        value={results.soulUrge}
                                        label={t('soulUrge')}
                                    />
                                </View>
                                <View style={[styles.statsRow, styles.statsRowBottom]}>
                                    <StatCard
                                        icon={<User color={Colors.primary} size={18} />}
                                        value={results.personality}
                                        label={t('personality')}
                                    />
                                    <View style={styles.statGap} />
                                    <StatCard
                                        accent
                                        icon={<CalendarDays color={Colors.primary} size={18} />}
                                        value={results.personalYear}
                                        label={t('personalYear')}
                                    />
                                </View>
                            </View>
                        )}

                        {/* ── READING ── */}
                        <View style={styles.readingSection}>
                            <View style={styles.readingHeader}>
                                <Sparkles color={Colors.primary} size={18} />
                                <MysticalText style={styles.readingTitle}>
                                    {t('blueprintReady')}
                                </MysticalText>
                            </View>

                            <View style={styles.readingDivider} />

                            {isPro ? (
                                <>
                                    {/* Collapsed: first N paragraphs + fade + expand toggle */}
                                    {(readingExpanded ? paragraphs : paragraphs.slice(0, COLLAPSED_PARA_COUNT)).map(
                                        (para: string, i: number, arr: string[]) => (
                                            <View key={i} style={[styles.paragraph, i < arr.length - 1 && styles.paragraphBorder]}>
                                                <View style={styles.paragraphDot} />
                                                <MysticalText style={styles.paragraphText}>{para}</MysticalText>
                                            </View>
                                        )
                                    )}

                                    {/* Expand / collapse toggle — only shown when there are more paragraphs */}
                                    {paragraphs.length > COLLAPSED_PARA_COUNT && (
                                        <View style={styles.readingToggleWrap}>
                                            {!readingExpanded && (
                                                <LinearGradient
                                                    colors={['rgba(10,6,18,0)', 'rgba(10,6,18,0.82)', 'rgba(10,6,18,0.97)']}
                                                    style={styles.readingCollapseGradient}
                                                    pointerEvents="none"
                                                />
                                            )}
                                            <TouchableOpacity
                                                style={styles.readingToggleBtn}
                                                onPress={() => setReadingExpanded(e => !e)}
                                                activeOpacity={0.75}
                                            >
                                                <MysticalText style={styles.readingToggleText}>
                                                    {readingExpanded ? t('readingCollapseBtn') : t('readingExpandBtn')}
                                                </MysticalText>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            ) : (
                                <View style={styles.teaserContainer}>
                                    {/* Text — first 2 paragraphs rendered but mostly covered */}
                                    {teaserParas.map((para: string, i: number) => (
                                        <View key={i} style={[styles.paragraph, i < teaserParas.length - 1 && styles.paragraphBorder]}>
                                            <View style={styles.paragraphDot} />
                                            <MysticalText style={styles.paragraphText}>{para}</MysticalText>
                                        </View>
                                    ))}

                                    {/* Gradient: transparent for first ~2 lines, dark from line 3 onward */}
                                    <LinearGradient
                                        colors={[
                                            'rgba(10,6,18,0)',
                                            'rgba(10,6,18,0)',
                                            'rgba(10,6,18,0.75)',
                                            Colors.background,
                                            Colors.background,
                                        ]}
                                        locations={[0, 0.18, 0.36, 0.58, 1]}
                                        style={styles.teaserGradient}
                                        pointerEvents="none"
                                    />

                                    {/* Unlock button absolutely placed in the dark zone */}
                                    <TouchableOpacity
                                        style={styles.teaserUnlockBtn}
                                        onPress={() => navigation.navigate('Paywall')}
                                        activeOpacity={0.85}
                                    >
                                        <LinearGradient
                                            colors={['#b794f6', '#9b59b6', '#7d3c98']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.teaserUnlockGradient}
                                        >
                                            <Ionicons name="lock-open-outline" size={19} color="#fff" />
                                            <MysticalText style={styles.teaserUnlockText}>{t('analysisUnlockFullAnalysis')}</MysticalText>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* ── SHARE (Pro) — inline; View Dashboard is in sticky footer ── */}
                        {isPro && (
                            <TouchableOpacity style={styles.shareRow} onPress={handleShare}>
                                <Share2 color={Colors.primary} size={18} />
                                <MysticalText style={styles.shareText}>{t('shareResult')}</MysticalText>
                            </TouchableOpacity>
                        )}

                        {/* ── DAILY GUIDANCE (only after unlock) — bonus content below CTA ── */}
                        {isPro && (
                            <View style={styles.guidanceCard}>
                                {/* Background decoration */}
                                <View style={styles.guidanceGlowBL} pointerEvents="none" />
                                <View style={styles.guidanceGlowTR} pointerEvents="none" />

                                {/* Header */}
                                <View style={styles.guidanceHeader}>
                                    <View style={styles.guidanceBadge}>
                                        <Zap color={Colors.primary} size={13} />
                                        <MysticalText style={styles.guidanceBadgeText}>{t('dailyGuidanceBadge')}</MysticalText>
                                    </View>
                                </View>
                                <MysticalText style={styles.guidanceTitle}>{t('dailyGuidanceTitle')}</MysticalText>
                                <MysticalText style={styles.guidanceSub}>{t('dailyGuidanceSub')}</MysticalText>

                                {/* Feature rows */}
                                <View style={styles.featuresWrap}>
                                    {[
                                        {
                                            icon: <MessageCircle color="#a78bfa" size={20} />,
                                            bg: 'rgba(139,92,246,0.15)',
                                            labelKey: 'dailyGuidanceFeatureOracle',
                                            descKey: 'dailyGuidanceFeatureOracleDesc',
                                        },
                                        {
                                            icon: <Zap color="#facc15" size={20} />,
                                            bg: 'rgba(250,204,21,0.12)',
                                            labelKey: 'dailyGuidanceFeatureEnergy',
                                            descKey: 'dailyGuidanceFeatureEnergyDesc',
                                        },
                                        {
                                            icon: <Users color="#34d399" size={20} />,
                                            bg: 'rgba(52,211,153,0.12)',
                                            labelKey: 'dailyGuidanceFeatureConnections',
                                            descKey: 'dailyGuidanceFeatureConnectionsDesc',
                                        },
                                        {
                                            icon: <LayoutGrid color="#60a5fa" size={20} />,
                                            bg: 'rgba(96,165,250,0.12)',
                                            labelKey: 'dailyGuidanceFeatureToolkit',
                                            descKey: 'dailyGuidanceFeatureToolkitDesc',
                                        },
                                    ].map((f, i) => (
                                        <View key={i} style={styles.featureRow}>
                                            <View style={[styles.featureIconCircle, { backgroundColor: f.bg }]}>
                                                {f.icon}
                                            </View>
                                            <View style={styles.featureText}>
                                                <MysticalText style={styles.featureLabel}>{t(f.labelKey)}</MysticalText>
                                                <MysticalText style={styles.featureDesc}>{t(f.descKey)}</MysticalText>
                                            </View>
                                            <View style={styles.featureCheck}>
                                                <View style={styles.featureCheckDot} />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                    </Animated.View>
                </ScrollView>

                {/* ── STICKY "View Dashboard" FOOTER ── */}
                {isPro && (
                    <View
                        style={[
                            styles.stickyFooter,
                            { paddingBottom: Math.max(insets.bottom, 16) },
                        ]}
                        pointerEvents="box-none"
                    >
                        <LinearGradient
                            colors={['rgba(10,6,18,0)', 'rgba(10,6,18,0.92)', '#0a0612']}
                            style={StyleSheet.absoluteFill}
                            pointerEvents="none"
                        />
                        <Button title={t('viewDashboard')} onPress={goToHome} variant="primary" />
                    </View>
                )}
            </SafeAreaView>
        </GradientBackground>
    );
};

const CIRCLE_SIZE = 120;
const RING_SIZE = CIRCLE_SIZE + 32;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 36,
        paddingBottom: 48,
    },

    // Hero
    hero: {
        alignItems: 'center',
        marginBottom: 36,
    },
    heroLifePathCallout: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
        textAlign: 'center',
        letterSpacing: 0.3,
        marginBottom: 14,
        paddingHorizontal: 12,
    },
    heroRingStack: {
        width: RING_SIZE,
        height: RING_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,
    },
    pulseRing: {
        position: 'absolute',
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: RING_SIZE / 2,
        borderWidth: 1.5,
        borderColor: 'rgba(212,175,55,0.35)',
    },
    heroCircle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 12,
        paddingTop: 6,
    },
    heroCircleKicker: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2.5,
        textTransform: 'uppercase',
        color: Colors.primary,
        opacity: 0.75,
        marginBottom: 2,
    },
    heroNumber: {
        fontSize: 48,
        fontWeight: '900',
        color: Colors.primary,
        lineHeight: 54,
    },
    heroTitle: {
        textAlign: 'center',
        marginBottom: 6,
    },
    heroSubtitle: {
        textAlign: 'center',
        opacity: 0.6,
        fontSize: 14,
    },

    // Stats grid
    statsSection: {
        marginBottom: 32,
    },
    statsRow: {
        flexDirection: 'row',
    },
    statsRowBottom: {
        marginTop: 10,
    },
    statGap: {
        width: 10,
    },

    // Reading
    readingSection: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.15)',
        padding: 20,
        marginBottom: 32,
        overflow: 'hidden',
    },
    readingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    readingTitle: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: Colors.primary,
        opacity: 0.85,
    },
    readingDivider: {
        height: 1,
        backgroundColor: 'rgba(212,175,55,0.2)',
        marginBottom: 18,
    },
    paragraph: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingBottom: 18,
        gap: 12,
    },
    paragraphBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        marginBottom: 18,
    },
    paragraphDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        opacity: 0.6,
        marginTop: 8,
        flexShrink: 0,
    },
    paragraphText: {
        flex: 1,
        lineHeight: 26,
        fontSize: 15,
        color: 'rgba(255,255,255,0.88)',
    },
    teaserContainer: {
        height: TEASER_HEIGHT,
        overflow: 'hidden',
        position: 'relative',
    },
    teaserGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    teaserUnlockBtn: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        marginHorizontal: 4,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#9b59b6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
        elevation: 12,
    },
    teaserUnlockGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 15,
        paddingHorizontal: 24,
    },
    teaserUnlockText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.3,
    },

    // Reading expand/collapse toggle (Pro)
    readingToggleWrap: {
        position: 'relative',
        marginTop: -8,
    },
    readingCollapseGradient: {
        position: 'absolute',
        top: -64,
        left: 0,
        right: 0,
        height: 80,
        pointerEvents: 'none',
    },
    readingToggleBtn: {
        alignSelf: 'center',
        paddingVertical: 9,
        paddingHorizontal: 20,
        marginTop: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.3)',
        backgroundColor: 'rgba(212,175,55,0.07)',
    },
    readingToggleText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
        letterSpacing: 0.2,
    },

    // Sticky "View Dashboard" footer
    stickyFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 20,
        overflow: 'hidden',
    },

    // Share row (inline, above guidance card)
    shareRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 10,
    },
    shareText: {
        color: Colors.primary,
        fontWeight: '600',
    },

    // Daily Guidance card
    guidanceCard: {
        backgroundColor: '#0b0720',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(155,89,182,0.3)',
        padding: 22,
        marginBottom: 28,
        overflow: 'hidden',
        position: 'relative',
    },
    guidanceGlowBL: {
        position: 'absolute',
        bottom: -40,
        left: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(155,89,182,0.12)',
    },
    guidanceGlowTR: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(212,175,55,0.07)',
    },
    guidanceHeader: {
        marginBottom: 10,
    },
    guidanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(212,175,55,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    guidanceBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        color: Colors.primary,
    },
    guidanceTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 6,
        lineHeight: 26,
    },
    guidanceSub: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 20,
        lineHeight: 18,
    },
    featuresWrap: {
        gap: 12,
        marginBottom: 22,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    featureIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    featureText: {
        flex: 1,
    },
    featureLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 12,
        color: Colors.textSecondary,
        lineHeight: 16,
    },
    featureCheck: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'rgba(212,175,55,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    featureCheckDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        opacity: 0.6,
    },
    guidanceCtaBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    guidanceCtaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    guidanceCtaText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
});
