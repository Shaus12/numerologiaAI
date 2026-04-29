import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    Pressable,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';

import { GradientBackground } from '../../components/shared/GradientBackground';
import { AnalysisMagicalBackground } from '../../components/analysis/AnalysisMagicalBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { useRevenueCat, computeIsPro } from '../../context/RevenueCatContext';
import { useUser } from '../../context/UserContext';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';
import { scheduleSubscriberJourney, scheduleTrialRetentionNotifications, scheduleMonthlyForecastNotifications } from '../../utils/notifications';
import { buildCalculatingUserPayload } from '../../utils/buildCalculatingUserPayload';
import { CheckCircle2, Check, X } from 'lucide-react-native';
import { useOnboardingStore } from '../../../store/onboardingStore';
import { ONBOARDING_PAYWALL_FEATURES, type OnboardingBranchKey } from '../../../constants/onboardingData';
import { persistOnboardingResumeForPaywall } from '../../utils/onboardingResumeStorage';

const ONBOARDING_PAYWALL_HERO_TKEY = {
    love_single: 'onboardingPaywallHeroLoveSingle',
    love_rel: 'onboardingPaywallHeroLoveRel',
    career: 'onboardingPaywallHeroCareer',
    growth: 'onboardingPaywallHeroGrowth',
    wellness: 'onboardingPaywallHeroWellness',
} as const satisfies Record<OnboardingBranchKey, string>;

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

const PAYWALL_FEATURES = ['paywallFeature1', 'paywallFeature2', 'paywallFeature3', 'paywallFeature4'] as const;

const DEMO_MONTHLY = '$9.99';
const DEMO_ANNUAL = '$49.99';
const DEMO_ANNUAL_PER_MO = '$4.17';

function getMonthlyPackage(packages: PurchasesPackage[]): PurchasesPackage | null {
    return packages.find((p) => p.packageType === Purchases.PACKAGE_TYPE.MONTHLY) ?? null;
}

function getAnnualPackage(packages: PurchasesPackage[]): PurchasesPackage | null {
    return packages.find((p) => p.packageType === Purchases.PACKAGE_TYPE.ANNUAL) ?? null;
}

function computeSavePercent(monthlyPkg: PurchasesPackage, annualPkg: PurchasesPackage): number | null {
    try {
        const monthlyPrice = monthlyPkg.product.price;
        const annualPrice = annualPkg.product.price;
        if (monthlyPrice <= 0) return null;
        const monthlyEquivalent = monthlyPrice * 12;
        const percent = (1 - annualPrice / monthlyEquivalent) * 100;
        return Math.round(percent);
    } catch {
        return null;
    }
}

function formatMonthlyEquivalent(annualPkg: PurchasesPackage): string {
    try {
        const price = annualPkg.product.price / 12;
        const currencyCode = (annualPkg.product as any).currencyCode ?? 'USD';
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    } catch {
        return annualPkg.product.priceString;
    }
}

type PlanCardProps = {
    isSelected: boolean;
    onPress: () => void;
    children: React.ReactNode;
    hero?: boolean;
    /** When true, content hugs the top of the card (e.g. monthly vs taller annual). */
    alignTop?: boolean;
};

function AnimatedPlanCard({ isSelected, onPress, children, hero, alignTop }: PlanCardProps) {
    const progress = useSharedValue(isSelected ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(isSelected ? 1 : 0, { duration: 260 });
    }, [isSelected, progress]);

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(progress.value, [0, 1], [1, 1.02], Extrapolation.CLAMP);
        const borderOpacity = interpolate(progress.value, [0, 1], [0.14, 0.95]);
        const glow = interpolate(progress.value, [0, 1], [0, 1]);
        return {
            transform: [{ scale }],
            borderColor: `rgba(212, 175, 55, ${borderOpacity})`,
            borderWidth: interpolate(progress.value, [0, 1], [1, 2.5]),
            shadowOpacity: 0.12 + glow * 0.38,
            shadowRadius: 6 + glow * 14,
            elevation: 4 + glow * 10,
        };
    });

    return (
        <Pressable onPress={onPress} style={styles.planCardPress}>
            <Animated.View
                style={[
                    styles.planCardInner,
                    hero && styles.planCardHeroTint,
                    alignTop && styles.planCardInnerAlignTop,
                    animatedStyle,
                ]}
            >
                {children}
            </Animated.View>
        </Pressable>
    );
}

export const PaywallScreen: React.FC<Props> = ({ navigation }) => {
    const route = useRoute();
    const params = route.params as { variant?: 'onboarding' } | undefined;
    const isOnboarding = params?.variant === 'onboarding';
    const branchId = useOnboardingStore((s) => s.branchId);
    const lifePathNumber = useOnboardingStore((s) => s.lifePathNumber);
    const onboardingBranch: OnboardingBranchKey =
        branchId && branchId in ONBOARDING_PAYWALL_HERO_TKEY ? (branchId as OnboardingBranchKey) : 'growth';

    const onboardingHeroTitleKey = ONBOARDING_PAYWALL_HERO_TKEY[onboardingBranch];
    const onboardingPaywallFeatures = ONBOARDING_PAYWALL_FEATURES[onboardingBranch];

    const { t, language } = useSettings();
    const { numerologyResults, userProfile } = useUser();
    const posthog = usePostHog();
    const { restorePurchases, isPro } = useRevenueCat();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const compact = height < 700;
    /** Safe area + footer chrome + small gap so price cards sit just above redeem row. */
    const scrollPadBottom = Math.round(insets.bottom + (Platform.OS === 'ios' ? 172 : 158));

    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [loadingOfferings, setLoadingOfferings] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const monthlyPackage = getMonthlyPackage(packages);
    const annualPackage = getAnnualPackage(packages);
    const savePercent =
        monthlyPackage && annualPackage ? computeSavePercent(monthlyPackage, annualPackage) : null;

    const loadOfferings = useCallback(async () => {
        setLoadingOfferings(true);
        try {
            const offerings = await Purchases.getOfferings();
            const current = offerings.current;
            const list = current?.availablePackages ?? [];
            setPackages(list);
            const annual = getAnnualPackage(list);
            const monthly = getMonthlyPackage(list);
            setSelectedPackage(monthly ?? annual ?? list[0] ?? null);
        } catch (e) {
            console.error('Paywall getOfferings error:', e);
            setPackages([]);
            setSelectedPackage(null);
        } finally {
            setLoadingOfferings(false);
        }
    }, []);

    useEffect(() => {
        loadOfferings();
    }, [loadOfferings]);

    useEffect(() => {
        if (posthog) {
            posthog.capture('paywall_viewed');
        }
    }, [posthog]);

    useEffect(() => {
        if (isOnboarding) {
            void persistOnboardingResumeForPaywall();
        }
    }, [isOnboarding]);

    useEffect(() => {
        if (!isPro) return;
        if (isOnboarding) {
            const payload = buildCalculatingUserPayload(useOnboardingStore.getState(), language);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Calculating', params: { userData: payload } }],
            });
            return;
        }
        navigation.goBack();
    }, [isPro, navigation, isOnboarding, language]);

    const handlePurchase = async () => {
        if (!selectedPackage || isPurchasing) return;
        if (posthog) {
            posthog.capture('trial_button_clicked');
        }
        setIsPurchasing(true);
        try {
            const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
            if (!computeIsPro(customerInfo)) {
                Alert.alert('', t('paywallErrorPurchase'));
                return;
            }

            const lp = lifePathNumber ?? numerologyResults?.lifePath ?? 9;
            const branchForJourney =
                branchId && String(branchId).length > 0 ? branchId : 'growth';
            const userBirthDate = userProfile?.birthdate || useOnboardingStore.getState().birthDate || new Date().toISOString();

            scheduleSubscriberJourney(lp, branchForJourney, language).catch((err) =>
                console.warn('scheduleSubscriberJourney error:', err),
            );
            scheduleMonthlyForecastNotifications(lp, userBirthDate, branchForJourney, language).catch((err) =>
                console.warn('scheduleMonthlyForecastNotifications error:', err),
            );
            scheduleTrialRetentionNotifications(language).catch(() => undefined);

            if (posthog) {
                posthog.capture('subscription_purchase_success', { onboarding: isOnboarding });
            }
            
            if (isOnboarding) {
                const payload = buildCalculatingUserPayload(useOnboardingStore.getState(), language);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Calculating', params: { userData: payload } }],
                });
            } else {
                navigation.goBack();
            }
        } catch (e: any) {
            if (e?.userCancelled === true) return;
            console.error('Paywall purchase error:', e);
            const msg = e?.userInfo?.readableErrorCode ?? e?.userInfo?.message ?? e?.message ?? t('paywallErrorPurchase');
            Alert.alert('', String(msg));
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestore = async () => {
        try {
            const info = await restorePurchases();
            if (info && computeIsPro(info)) {
                const lp = lifePathNumber ?? numerologyResults?.lifePath ?? 9;
                const branchForJourney =
                    branchId && String(branchId).length > 0 ? branchId : 'growth';
                const userBirthDate = userProfile?.birthdate || useOnboardingStore.getState().birthDate || new Date().toISOString();
                scheduleSubscriberJourney(lp, branchForJourney, language).catch((err) =>
                    console.warn('scheduleSubscriberJourney (restore) error:', err),
                );
                scheduleMonthlyForecastNotifications(lp, userBirthDate, branchForJourney, language).catch((err) =>
                    console.warn('scheduleMonthlyForecastNotifications (restore) error:', err),
                );

                if (isOnboarding) {
                    const payload = buildCalculatingUserPayload(useOnboardingStore.getState(), language);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Calculating', params: { userData: payload } }],
                    });
                } else {
                    navigation.goBack();
                }
            } else {
                Alert.alert('', t('paywallErrorRestore'));
            }
        } catch {
            Alert.alert('', t('paywallErrorRestore'));
        }
    };

    const handleRedeemCode = () => {
        if (Platform.OS !== 'ios') return;
        try {
            const anyPurchases = Purchases as any;
            if (typeof anyPurchases.presentCodeRedemptionSheet === 'function') {
                anyPurchases.presentCodeRedemptionSheet();
            }
        } catch (e) {
            console.warn('Redeem code sheet error', e);
        }
    };

    const openTerms = () => navigation.navigate('TermsOfUse');
    const openPrivacy = () => navigation.navigate('PrivacyPolicy');

    const useMagicalBg = isOnboarding;

    const annualSelected = annualPackage ? selectedPackage?.identifier === annualPackage.identifier : false;
    const monthlySelected = monthlyPackage ? selectedPackage?.identifier === monthlyPackage.identifier : false;

    const planSection = loadingOfferings ? (
        <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <MysticalText variant="body" style={styles.loadingText}>
                {t('paywallLoadingOfferings')}
            </MysticalText>
        </View>
    ) : (
        <>
            <View style={styles.cardsRow}>
                {/* Annual first; default selection is monthly when available */}
                <View style={[styles.cardColumn, styles.annualColumn]}>
                    <AnimatedPlanCard
                        isSelected={!!annualPackage && annualSelected}
                        onPress={() => annualPackage && setSelectedPackage(annualPackage)}
                        hero
                    >
                        <MysticalText variant="body" style={styles.packageTitle}>
                            {t('paywallYearly')}
                        </MysticalText>
                        <Text style={styles.annualPriceMain} maxFontSizeMultiplier={1.08}>
                            {annualPackage?.product.priceString ?? DEMO_ANNUAL}
                            <Text style={styles.annualPriceSuffix}>/yr</Text>
                        </Text>
                        <Text style={styles.priceMonthlyEquiv} maxFontSizeMultiplier={1.05}>
                            {annualPackage
                                ? t('paywallAnnualEquivalentPerMonth').replace(
                                      '{{price}}',
                                      formatMonthlyEquivalent(annualPackage),
                                  )
                                : `Only ${DEMO_ANNUAL_PER_MO}/month`}
                        </Text>
                        {savePercent != null && savePercent > 0 ? (
                            <View style={styles.savePill}>
                                <Text style={styles.savePillText}>
                                    {t('paywallSavePercent').replace('{{n}}', String(savePercent))}
                                </Text>
                            </View>
                        ) : null}
                    </AnimatedPlanCard>
                </View>
                {/* Option B: Monthly */}
                <View style={styles.cardColumn}>
                    <AnimatedPlanCard
                        isSelected={!!monthlyPackage && monthlySelected}
                        onPress={() => monthlyPackage && setSelectedPackage(monthlyPackage)}
                        hero={false}
                        alignTop
                    >
                        <MysticalText variant="body" style={styles.packageTitle}>
                            {t('paywallMonthly')}
                        </MysticalText>
                        <Text style={styles.packagePriceGold} maxFontSizeMultiplier={1.1}>
                            {monthlyPackage?.product.priceString ?? DEMO_MONTHLY}
                            <Text style={styles.perMonth}>{t('paywallPricePerMonthSuffix')}</Text>
                        </Text>
                    </AnimatedPlanCard>
                </View>
            </View>
            {packages.length === 0 && !loadingOfferings && (
                <MysticalText variant="body" style={styles.noPackages}>
                    {t('paywallNoPackagesAvailable')}
                </MysticalText>
            )}
        </>
    );

    const stickyFooter = (
        <View style={styles.bottomDock}>
            <LinearGradient
                colors={['transparent', 'rgba(8, 6, 20, 0.94)', 'rgba(8, 6, 20, 0.98)']}
                locations={[0, 0.25, 1]}
                style={styles.bottomDockFade}
                pointerEvents="none"
            />
            <View style={styles.bottomDockInner}>
                <View style={styles.dockLinksBlock}>
                    {Platform.OS === 'ios' && (
                        <TouchableOpacity
                            style={styles.redeemCodeButtonDock}
                            onPress={handleRedeemCode}
                            activeOpacity={0.85}
                            hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
                        >
                            <MysticalText variant="caption" style={styles.redeemCodeText}>
                                {t('paywallRedeemCode')}
                            </MysticalText>
                        </TouchableOpacity>
                    )}
                    <View style={styles.footerDock}>
                        <TouchableOpacity
                            onPress={handleRestore}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                            <MysticalText variant="caption" style={styles.footerLink}>
                                {t('paywallRestorePurchases')}
                            </MysticalText>
                        </TouchableOpacity>
                        <View style={styles.footerDivider} />
                        <TouchableOpacity onPress={openTerms} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                            <MysticalText variant="caption" style={styles.footerLink}>
                                {t('termsOfUse')}
                            </MysticalText>
                        </TouchableOpacity>
                        <View style={styles.footerDivider} />
                        <TouchableOpacity onPress={openPrivacy} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                            <MysticalText variant="caption" style={styles.footerLink}>
                                {t('privacyPolicy')}
                            </MysticalText>
                        </TouchableOpacity>
                    </View>
                </View>
                <Pressable
                    style={({ pressed }) => [
                        styles.ctaOuter,
                        pressed && styles.ctaPressed,
                        (!selectedPackage || isPurchasing) && styles.ctaDisabled,
                    ]}
                    onPress={handlePurchase}
                    disabled={!selectedPackage || isPurchasing}
                >
                    <LinearGradient
                        colors={Colors.goldGradient as [string, string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaGradient}
                    >
                        {isPurchasing ? (
                            <ActivityIndicator color="#1a1408" size="small" />
                        ) : (
                            <Text style={styles.ctaLabel} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82}>
                                {t('paywallCtaTryFree')}
                            </Text>
                        )}
                    </LinearGradient>
                </Pressable>
                <MysticalText style={styles.trustMini}>{t('paywallTrustLine')}</MysticalText>
            </View>
        </View>
    );

    const inner = (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[
                        styles.scrollContent,
                        styles.scrollContentGrow,
                        { paddingBottom: scrollPadBottom },
                        compact && styles.scrollContentCompact,
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.header, isOnboarding && styles.headerOnboardingPaywall]}>
                        {isOnboarding ? (
                            <Text style={styles.onboardingHeroTitle} maxFontSizeMultiplier={1.15}>
                                {t(onboardingHeroTitleKey)}
                            </Text>
                        ) : (
                            <>
                                <MysticalText variant="h1" style={styles.title}>
                                    {t('paywallTitle')}
                                </MysticalText>
                                <MysticalText style={styles.subtitle}>{t('paywallSubtitle')}</MysticalText>
                            </>
                        )}
                    </View>

                    <View style={styles.features}>
                        {isOnboarding
                            ? onboardingPaywallFeatures.map((item, idx) => {
                                  const title = t(item.titleKey);
                                  const subtitle = t(item.subtitleKey);
                                  return (
                                      <View key={`${item.titleKey}-${idx}`} style={styles.obFeatureRow}>
                                          <View style={styles.checkGoldRing}>
                                              <Check color={Colors.primary} size={16} strokeWidth={2.8} />
                                          </View>
                                          <View style={styles.obFeatureTextCol}>
                                              <Text style={styles.obFeatureTitle} maxFontSizeMultiplier={1.12}>
                                                  {title}
                                              </Text>
                                              {subtitle ? (
                                                  <Text style={styles.obFeatureSub} maxFontSizeMultiplier={1.1}>
                                                      {subtitle}
                                                  </Text>
                                              ) : null}
                                          </View>
                                      </View>
                                  );
                              })
                            : PAYWALL_FEATURES.map((key) => (
                                  <View key={key} style={styles.featureRow}>
                                      <CheckCircle2 color={Colors.primary} size={20} style={styles.check} />
                                      <MysticalText variant="body" style={styles.featureText}>
                                          {t(key)}
                                      </MysticalText>
                                  </View>
                              ))}
                    </View>

                    <View style={styles.planPushSpacer} />

                    <View style={styles.planSectionWrap}>{planSection}</View>
                </ScrollView>
            </KeyboardAvoidingView>

            {stickyFooter}

            <TouchableOpacity
                style={[styles.closeButton, { top: insets.top + 8 }]}
                onPress={() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                        return;
                    }
                    if (isOnboarding) {
                        navigation.replace('Analysis');
                    }
                }}
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
                <X color={Colors.textSecondary} size={26} />
            </TouchableOpacity>
        </>
    );

    if (useMagicalBg) {
        return (
            <View style={styles.rootPremium}>
                <AnalysisMagicalBackground />
                <SafeAreaView style={styles.safePremium} edges={['top', 'left', 'right', 'bottom']}>
                    {inner}
                </SafeAreaView>
            </View>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
                {inner}
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    rootPremium: {
        flex: 1,
        backgroundColor: '#080614',
    },
    safePremium: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    safe: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 18,
    },
    scrollContentCompact: {
        paddingTop: 12,
    },
    scrollContentGrow: {
        flexGrow: 1,
    },
    closeButton: {
        position: 'absolute',
        right: 18,
        zIndex: 20,
        padding: 4,
    },
    header: {
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 14,
    },
    headerOnboardingPaywall: {
        marginBottom: 20,
    },
    onboardingHeroTitle: {
        color: '#faf8ff',
        fontSize: 26,
        lineHeight: 32,
        textAlign: 'center',
        fontWeight: '500',
        paddingHorizontal: 8,
        ...Platform.select({
            ios: { fontFamily: 'Georgia' },
            android: { fontFamily: 'serif' },
        }),
    },
    title: {
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        color: Colors.textSecondary,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        paddingHorizontal: 10,
        marginTop: 6,
        opacity: 0.92,
    },
    features: {
        marginTop: 6,
        marginBottom: 12,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 13,
    },
    check: {
        marginRight: 12,
        flexShrink: 0,
    },
    featureText: {
        color: Colors.text,
        flex: 1,
        fontSize: 15,
    },
    obFeatureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 14,
    },
    checkGoldRing: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: 'rgba(212, 175, 55, 0.14)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        ...Platform.select({
            android: { elevation: 3 },
        }),
    },
    obFeatureTextCol: {
        flex: 1,
        paddingTop: 1,
    },
    obFeatureTitle: {
        color: 'rgba(252, 250, 255, 0.98)',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        marginBottom: 5,
        letterSpacing: 0.15,
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    obFeatureSub: {
        color: 'rgba(148, 156, 178, 0.95)',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
    planPushSpacer: {
        flexGrow: 1,
        minHeight: 6,
    },
    planSectionWrap: {
        marginBottom: 0,
    },
    loadingBox: {
        alignItems: 'center',
        paddingVertical: 28,
    },
    loadingText: {
        color: Colors.textSecondary,
        marginTop: 12,
    },
    cardsRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
    },
    cardColumn: {
        flex: 1,
    },
    annualColumn: {
        position: 'relative',
    },
    planCardPress: {
        flex: 1,
    },
    planCardInner: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(255,255,255,0.04)',
        minHeight: 110,
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
    },
    planCardHeroTint: {
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
    },
    planCardInnerAlignTop: {
        justifyContent: 'flex-start',
        paddingTop: 12,
    },
    packageTitle: {
        color: Colors.text,
        marginBottom: 4,
        fontSize: 14,
        fontWeight: '700',
    },
    annualPriceMain: {
        color: Colors.primary,
        fontWeight: '800',
        fontSize: 15,
        marginTop: 0,
    },
    annualPriceSuffix: {
        color: 'rgba(220, 210, 180, 0.9)',
        fontWeight: '600',
        fontSize: 12,
    },
    packagePriceGold: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 15,
    },
    perMonth: {
        color: 'rgba(200, 206, 220, 0.85)',
        fontWeight: '500',
        fontSize: 12,
    },
    priceMonthlyEquiv: {
        color: '#f4e4a8',
        fontWeight: '800',
        fontSize: 12,
        marginTop: 4,
    },
    savePill: {
        marginTop: 5,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    savePillText: {
        color: Colors.primary,
        fontWeight: '800',
        fontSize: 10,
    },
    noPackages: {
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 16,
    },
    bottomDock: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 22,
        zIndex: 15,
    },
    bottomDockFade: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: Platform.OS === 'ios' ? 210 : 172,
        top: undefined,
    },
    bottomDockInner: {
        paddingTop: 8,
        paddingBottom: 10,
    },
    dockLinksBlock: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    redeemCodeButtonDock: {
        alignItems: 'center',
        paddingVertical: 2,
        marginBottom: 6,
    },
    footerDock: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    ctaOuter: {
        borderRadius: 28,
        overflow: 'hidden',
        minHeight: 62,
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.42,
                shadowRadius: 20,
            },
            android: { elevation: 16 },
        }),
    },
    ctaPressed: {
        opacity: 0.94,
        transform: [{ scale: 0.99 }],
    },
    ctaDisabled: {
        opacity: 0.55,
    },
    ctaGradient: {
        minHeight: 62,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaLabel: {
        color: '#1a1408',
        fontWeight: '900',
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 0.3,
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif-medium' },
        }),
    },
    trustMini: {
        marginTop: 10,
        color: 'rgba(130, 138, 158, 0.75)',
        fontSize: 11,
        textAlign: 'center',
    },
    redeemCodeText: {
        color: Colors.textSecondary,
        textDecorationLine: 'underline',
        opacity: 0.9,
    },
    footerLink: {
        color: Colors.textSecondary,
        textDecorationLine: 'underline',
    },
    footerDivider: {
        width: 1,
        height: 12,
        backgroundColor: Colors.textSecondary,
        opacity: 0.5,
    },
});
