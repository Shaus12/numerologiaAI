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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';
import { Sparkles, CheckCircle2, X } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

const PAYWALL_FEATURES = [
    'paywallFeature1',
    'paywallFeature2',
    'paywallFeature3',
    'paywallFeature4',
] as const;

function getMonthlyPackage(packages: PurchasesPackage[]): PurchasesPackage | null {
    return packages.find(p => p.packageType === Purchases.PACKAGE_TYPE.MONTHLY) ?? null;
}

function getAnnualPackage(packages: PurchasesPackage[]): PurchasesPackage | null {
    return packages.find(p => p.packageType === Purchases.PACKAGE_TYPE.ANNUAL) ?? null;
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
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    } catch {
        return annualPkg.product.priceString;
    }
}

export const PaywallScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useSettings();
    const posthog = usePostHog();
    const { purchasePackage, restorePurchases, isPro } = useRevenueCat();

    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [loadingOfferings, setLoadingOfferings] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const monthlyPackage = getMonthlyPackage(packages);
    const annualPackage = getAnnualPackage(packages);
    const savePercent = monthlyPackage && annualPackage ? computeSavePercent(monthlyPackage, annualPackage) : null;

    const loadOfferings = useCallback(async () => {
        setLoadingOfferings(true);
        try {
            const offerings = await Purchases.getOfferings();
            const current = offerings.current;
            const list = current?.availablePackages ?? [];
            setPackages(list);
            const annual = getAnnualPackage(list);
            const monthly = getMonthlyPackage(list);
            setSelectedPackage(annual ?? monthly ?? list[0] ?? null);
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
        if (isPro) {
            navigation.goBack();
        }
    }, [isPro, navigation]);

    const handlePurchase = async () => {
        if (!selectedPackage || isPurchasing) return;
        if (posthog) {
            posthog.capture('trial_button_clicked');
        }
        setIsPurchasing(true);
        try {
            await purchasePackage(selectedPackage);
            navigation.goBack();
        } catch (e: any) {
            const msg = e?.userInfo?.message ?? e?.message ?? t('paywallErrorPurchase');
            Alert.alert('', msg);
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestore = async () => {
        try {
            const info = await restorePurchases();
            if (info && (info.entitlements?.active != null && Object.keys(info.entitlements.active).length > 0)) {
                navigation.goBack();
            } else {
                Alert.alert('', t('paywallErrorRestore'));
            }
        } catch (e) {
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

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                    <X color={Colors.textSecondary} size={26} />
                </TouchableOpacity>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}
                >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <View style={styles.iconWrap}>
                            <Sparkles color={Colors.primary} size={40} strokeWidth={1.5} />
                        </View>
                        <MysticalText variant="h1" style={styles.title}>
                            {t('paywallTitle')}
                        </MysticalText>
                    </View>

                    <View style={styles.features}>
                        {PAYWALL_FEATURES.map((key) => (
                            <View key={key} style={styles.featureRow}>
                                <CheckCircle2 color={Colors.primary} size={22} style={styles.check} />
                                <MysticalText variant="body" style={styles.featureText}>
                                    {t(key)}
                                </MysticalText>
                            </View>
                        ))}
                    </View>

                    {loadingOfferings ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <MysticalText variant="body" style={styles.loadingText}>
                                {t('paywallLoadingOfferings')}
                            </MysticalText>
                        </View>
                    ) : (
                        <>
                            <MysticalText variant="body" style={styles.tryFreeCopy}>
                                {t('paywallTryFreeThen')}
                            </MysticalText>
                            <View style={styles.cardsRow}>
                                {monthlyPackage && (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => setSelectedPackage(monthlyPackage)}
                                        style={styles.cardColumn}
                                    >
                                        <GlassCard
                                            border
                                            style={[
                                                styles.packageCard,
                                                styles.packageCardMonthly,
                                                selectedPackage?.identifier === monthlyPackage.identifier && styles.packageCardSelected,
                                            ]}
                                        >
                                            <MysticalText variant="h2" style={styles.packageTitle}>
                                                {t('paywallMonthly')}
                                            </MysticalText>
                                            <MysticalText variant="body" style={styles.packagePrice}>
                                                {monthlyPackage.product.priceString}
                                                <MysticalText variant="caption" style={styles.perMonth}> /mo</MysticalText>
                                            </MysticalText>
                                        </GlassCard>
                                    </TouchableOpacity>
                                )}
                                {annualPackage && (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => setSelectedPackage(annualPackage)}
                                        style={styles.cardColumn}
                                    >
                                        <GlassCard
                                            border
                                            style={[
                                                styles.packageCard,
                                                styles.packageCardYearly,
                                                selectedPackage?.identifier === annualPackage.identifier && styles.packageCardSelected,
                                            ]}
                                        >
                                            <MysticalText variant="h2" style={styles.packageTitle}>
                                                {t('paywallYearly')}
                                            </MysticalText>
                                            <MysticalText variant="body" style={styles.priceMonthlyEquiv}>
                                                Only {formatMonthlyEquivalent(annualPackage)} /month
                                            </MysticalText>
                                            <MysticalText variant="caption" style={styles.billedAnnually}>
                                                {t('paywallBilledAnnuallyAt').replace('{{price}}', annualPackage.product.priceString)}
                                            </MysticalText>
                                        </GlassCard>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {packages.length === 0 && !loadingOfferings && (
                                <MysticalText variant="body" style={styles.noPackages}>
                                    No subscription options available.
                                </MysticalText>
                            )}
                        </>
                    )}

                    <TouchableOpacity
                        style={[styles.cta, isPurchasing && styles.ctaDisabled]}
                        onPress={handlePurchase}
                        disabled={!selectedPackage || isPurchasing}
                        activeOpacity={0.85}
                    >
                        {isPurchasing ? (
                            <ActivityIndicator color={Colors.background} size="small" />
                        ) : (
                            <MysticalText variant="h2" style={styles.ctaText}>
                                {t('paywallCtaTryFree')}
                            </MysticalText>
                        )}
                    </TouchableOpacity>

                    {Platform.OS === "ios" && (
                        <TouchableOpacity
                            style={styles.redeemCodeButton}
                            onPress={handleRedeemCode}
                            activeOpacity={0.85}
                        >
                            <MysticalText variant="caption" style={styles.redeemCodeText}>
                                {t("paywallRedeemCode")}
                            </MysticalText>
                        </TouchableOpacity>
                    )}

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleRestore} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
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
                </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 20,
        zIndex: 10,
        padding: 4,
    },
    header: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 28,
    },
    iconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.35)',
    },
    title: {
        color: Colors.text,
        textAlign: 'center',
    },
    features: {
        marginBottom: 28,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    check: {
        marginRight: 12,
    },
    featureText: {
        color: Colors.text,
        flex: 1,
    },
    tryFreeCopy: {
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    loadingBox: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: Colors.textSecondary,
        marginTop: 12,
    },
    keyboardAvoid: {
        flex: 1,
    },
    cardsRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 12,
        marginBottom: 16,
    },
    cardColumn: {
        flex: 1,
    },
    packageCard: {
        flex: 1,
        opacity: 0.9,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    packageCardMonthly: {
        justifyContent: 'flex-start',
    },
    packageCardYearly: {
        borderColor: 'rgba(212, 175, 55, 0.35)',
        borderWidth: 1.5,
        backgroundColor: 'rgba(212, 175, 55, 0.06)',
        justifyContent: 'space-between',
    },
    packageCardSelected: {
        opacity: 1,
        borderColor: Colors.primary,
        borderWidth: 2.5,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 12,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(212, 175, 55, 0.25)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    badgeText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 11,
    },
    packageTitle: {
        color: Colors.text,
        marginBottom: 4,
    },
    packagePrice: {
        color: Colors.primary,
        fontWeight: '600',
    },
    priceMonthlyEquiv: {
        color: Colors.primary,
        fontWeight: '700',
        marginTop: 4,
    },
    perMonth: {
        color: Colors.textSecondary,
        fontWeight: '400',
    },
    billedAnnually: {
        color: Colors.textSecondary,
        marginTop: 6,
        fontSize: 12,
    },
    noPackages: {
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 24,
    },
    cta: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    ctaDisabled: {
        opacity: 0.8,
    },
    redeemCodeButton: {
        marginTop: 12,
        marginBottom: 4,
        alignItems: 'center',
    },
    redeemCodeText: {
        color: Colors.textSecondary,
        textDecorationLine: 'underline',
        opacity: 0.9,
    },
    ctaText: {
        color: Colors.background,
    },
    footer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 4,
    },
    footerLink: {
        color: Colors.textSecondary,
        textDecorationLine: 'underline',
    },
    footerDivider: {
        width: 1,
        height: 12,
        backgroundColor: Colors.textSecondary,
        opacity: 0.6,
    },
});
