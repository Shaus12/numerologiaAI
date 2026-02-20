import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { X, Check, Star } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRevenueCat } from '../../context/RevenueCatContext';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { RevenueCatConfig } from '../../constants/RevenueCat';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export const PaywallScreen: React.FC<Props> = ({ navigation }) => {
    const { purchasePackage, isPro, restorePurchases } = useRevenueCat();
    const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            navigation.goBack();
        } catch (e) {
            console.log('Purchase cancelled or failed');
        }
    };

    const handleRestore = async () => {
        const info = await restorePurchases();
        if (info?.entitlements.active[RevenueCatConfig.entitlementId]) {
            Alert.alert('Success', 'Your purchases have been restored.');
            navigation.goBack();
        } else {
            Alert.alert('Notice', 'No active subscription found to restore.');
        }
    };

    if (loading) {
        return (
            <GradientBackground>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
                        <X color="rgba(255,255,255,0.6)" size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.iconContainer}>
                        <Star color={Colors.primary} size={60} fill={Colors.primary} />
                    </View>

                    <MysticalText variant="h1" style={styles.title}>Unlock Your Destiny</MysticalText>
                    <MysticalText style={styles.subtitle}>Get full access to all numerology insights and AI predictions.</MysticalText>

                    <View style={styles.features}>
                        <FeatureItem text="Unlimited AI Oracle Chat" />
                        <FeatureItem text="Full Soul Match Compatibility" />
                        <FeatureItem text="Deep Destiny & Life Path Analysis" />
                        <FeatureItem text="Daily Personal Forecasts" />
                    </View>

                    <GlassCard style={styles.offerCard}>
                        <MysticalText variant="subtitle" style={styles.offerTitle}>7-DAY FREE TRIAL</MysticalText>
                        <MysticalText style={styles.offerPrice}>
                            then {pkg?.product.priceString}/month
                        </MysticalText>
                        <MysticalText variant="caption" style={styles.offerSub}>No commitment. Cancel anytime.</MysticalText>
                    </GlassCard>

                    <Button
                        title="Start Your 7-Day Free Trial"
                        onPress={handlePurchase}
                        style={styles.ctaBtn}
                    />

                    <TouchableOpacity onPress={handleRestore}>
                        <MysticalText variant="caption" style={styles.restoreText}>Restore Purchases</MysticalText>
                    </TouchableOpacity>

                    <MysticalText variant="caption" style={styles.disclaimer}>
                        Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                    </MysticalText>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    );
};

const FeatureItem = ({ text }: { text: string }) => (
    <View style={styles.featureItem}>
        <View style={styles.checkCircle}>
            <Check color={Colors.primary} size={14} strokeWidth={3} />
        </View>
        <MysticalText style={styles.featureText}>{text}</MysticalText>
    </View>
);

const styles = StyleSheet.create({
    safe: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 20, paddingTop: 10 },
    closeBtn: {
        width: 40, height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center'
    },
    content: { padding: 30, alignItems: 'center' },
    iconContainer: {
        width: 100, height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    title: { textAlign: 'center', marginBottom: 10, fontSize: 28 },
    subtitle: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 30, lineHeight: 22 },
    features: { width: '100%', gap: 15, marginBottom: 30 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    checkCircle: {
        width: 24, height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        justifyContent: 'center', alignItems: 'center',
    },
    featureText: { fontSize: 16 },
    offerCard: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        borderColor: Colors.primary,
    },
    offerTitle: { color: Colors.primary, marginBottom: 5 },
    offerPrice: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 5 },
    offerSub: { opacity: 0.7 },
    ctaBtn: { width: '100%', marginBottom: 20 },
    restoreText: { opacity: 0.6, marginBottom: 30 },
    disclaimer: { textAlign: 'center', opacity: 0.4, fontSize: 10, lineHeight: 14 },
});
