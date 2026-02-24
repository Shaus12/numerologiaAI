import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
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

export const PaywallScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useSettings();
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
        if (isPro) {
            navigation.goBack();
        }
    }, [isPro, navigation]);

    const handlePurchase = async () => {
        if (!selectedPackage || isPurchasing) return;
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
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
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
                        <View style={styles.cards}>
                            {monthlyPackage && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedPackage(monthlyPackage)}
                                    style={styles.cardTouch}
                                >
                                    <GlassCard
                                        border
                                        style={[
                                            styles.packageCard,
                                            selectedPackage?.identifier === monthlyPackage.identifier && styles.packageCardSelected,
                                        ]}
                                    >
                                        <View style={styles.packageHeader}>
                                            <MysticalText variant="h2" style={styles.packageTitle}>
                                                {t('paywallMonthly')}
                                            </MysticalText>
                                            <MysticalText variant="body" style={styles.packagePrice}>
                                                {monthlyPackage.product.priceString}
                                                <MysticalText variant="caption" style={styles.perMonth}>/month</MysticalText>
                                            </MysticalText>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            )}

                            {annualPackage && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedPackage(annualPackage)}
                                    style={styles.cardTouch}
                                >
                                    <GlassCard
                                        border
                                        style={[
                                            styles.packageCard,
                                            styles.packageCardYearly,
                                            selectedPackage?.identifier === annualPackage.identifier && styles.packageCardSelected,
                                        ]}
                                    >
                                        <View style={styles.badge}>
                                            <MysticalText variant="caption" style={styles.badgeText}>
                                                {savePercent != null && savePercent > 0
                                                    ? `${t('paywallBestValue')} · ${t('paywallSavePercent').replace('{{n}}', String(savePercent))}`
                                                    : t('paywallBestValue')}
                                            </MysticalText>
                                        </View>
                                        <View style={styles.packageHeader}>
                                            <MysticalText variant="h2" style={styles.packageTitle}>
                                                {t('paywallYearly')}
                                            </MysticalText>
                                            <MysticalText variant="body" style={styles.packagePrice}>
                                                {annualPackage.product.priceString}
                                                <MysticalText variant="caption" style={styles.perMonth}>/year</MysticalText>
                                            </MysticalText>
                                        </View>
                                        <MysticalText variant="caption" style={styles.billedAnnually}>
                                            {t('paywallBilledAnnuallyAt').replace('{{price}}', annualPackage.product.priceString)}
                                        </MysticalText>
                                    </GlassCard>
                                </TouchableOpacity>
                            )}

                            {packages.length === 0 && !loadingOfferings && (
                                <MysticalText variant="body" style={styles.noPackages}>
                                    No subscription options available.
                                </MysticalText>
                            )}
                        </View>
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
                                {t('paywallUnlockNow')}
                            </MysticalText>
                        )}
                    </TouchableOpacity>

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
    loadingBox: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: Colors.textSecondary,
        marginTop: 12,
    },
    cards: {
        gap: 14,
        marginBottom: 28,
    },
    cardTouch: {
        marginBottom: 4,
    },
    packageCard: {
        opacity: 0.85,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    packageCardYearly: {
        borderColor: 'rgba(212, 175, 55, 0.25)',
    },
    packageCardSelected: {
        opacity: 1,
        borderColor: Colors.primary,
        borderWidth: 2,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 12,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 10,
    },
    badgeText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    packageTitle: {
        color: Colors.text,
    },
    packagePrice: {
        color: Colors.primary,
        fontWeight: '600',
    },
    perMonth: {
        color: Colors.textSecondary,
        fontWeight: '400',
    },
    billedAnnually: {
        color: Colors.textSecondary,
        marginTop: 8,
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
