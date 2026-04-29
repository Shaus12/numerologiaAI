import React, { useMemo, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Modal, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { TimingSummaryCard } from '../../components/forecast/TimingSummaryCard';
import { CosmicRoadmap } from '../../components/forecast/CosmicRoadmap';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { Lock, ArrowLeft, Calendar, Compass, Briefcase, Heart, AlertTriangle, Star, Moon, Sun } from 'lucide-react-native';
import { useSettings } from '../../context/SettingsContext';
import { useRevenueCat } from '../../context/RevenueCatContext';
import { useUser } from '../../context/UserContext';
import { NumerologyEngine } from '../../utils/numerology';
import { PersonalYearInsights, PersonalMonthInsights, ForecastInsight } from '../../data/forecastData';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'Forecast'>,
    StackScreenProps<any>
>;

type ViewMode = 'month' | 'year';

export const ForecastScreen: React.FC<Props> = ({ navigation }) => {
    const { t, language } = useSettings();
    const { isPro } = useRevenueCat();
    const { userProfile } = useUser();
    
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [isTimingModalVisible, setIsTimingModalVisible] = useState(false);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const personalYear = useMemo(() => {
        if (!userProfile?.birthdate) return 0;
        return NumerologyEngine.calculatePersonalYear(userProfile.birthdate, currentYear);
    }, [userProfile?.birthdate, currentYear]);

    const personalMonth = useMemo(() => {
        if (!personalYear) return 0;
        return NumerologyEngine.calculatePersonalMonth(personalYear, currentMonth);
    }, [personalYear, currentMonth]);

    const currentLang = language || 'English';

    const baseYear = personalYear ? (PersonalYearInsights['English']?.[personalYear] || {}) : {};
    const localYear = personalYear ? (PersonalYearInsights[currentLang]?.[personalYear] || {}) : {};
    const activeYearInsight = personalYear ? { ...baseYear, ...localYear } : null;

    const baseMonth = personalMonth ? (PersonalMonthInsights['English']?.[personalMonth] || {}) : {};
    const localMonth = personalMonth ? (PersonalMonthInsights[currentLang]?.[personalMonth] || {}) : {};
    const activeMonthInsight = personalMonth ? { ...baseMonth, ...localMonth } : null;

    if (!isPro) {
        return <ForecastPaywallOverlay onBack={() => navigation.navigate('Home')} navigation={navigation} />;
    }

    const isMonth = viewMode === 'month';
    const activeNumber = isMonth ? personalMonth : personalYear;
    const activeInsight = (isMonth ? activeMonthInsight : activeYearInsight) as ForecastInsight | null;
    const HeroIcon = isMonth ? Moon : Sun;

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
                <View style={styles.header}>
                    <Compass color={Colors.primary} size={28} />
                    <MysticalText variant="h1" style={styles.headerTitle}>{t('tabForecast') || 'Forecast'}</MysticalText>
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentContainer}>
                    <TouchableOpacity 
                        style={[styles.segmentButton, isMonth && styles.segmentButtonActive]} 
                        onPress={() => setViewMode('month')}
                        activeOpacity={0.8}
                    >
                        <MysticalText style={styles.segmentText(isMonth)}>{t('forecastMonthTitle') || 'Monthly'}</MysticalText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.segmentButton, !isMonth && styles.segmentButtonActive]} 
                        onPress={() => setViewMode('year')}
                        activeOpacity={0.8}
                    >
                        <MysticalText style={styles.segmentText(!isMonth)}>{t('forecastYearTitle') || 'Yearly'}</MysticalText>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TimingSummaryCard onPress={() => setIsTimingModalVisible(true)} />

                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <HeroIcon color={Colors.primary} size={32} style={styles.heroIcon} />
                        <MysticalText variant="subtitle" style={styles.heroSubtitle}>
                            {isMonth ? (t('forecastMonthTitle') || 'Personal Month') : (t('forecastYearTitle') || 'Personal Year')}
                        </MysticalText>
                        <MysticalText style={styles.heroNumber}>{activeNumber || '-'}</MysticalText>
                        {activeInsight && <MysticalText variant="h2" style={styles.heroTitle}>{activeInsight.title}</MysticalText>}
                    </View>

                    {activeInsight ? (
                        <View style={styles.cardsContainer}>
                            {/* Overview */}
                            <GlassCard style={styles.contentCard}>
                                <View style={styles.cardHeader}>
                                    <SparklesIcon color={Colors.secondary} />
                                    <MysticalText variant="h3" style={styles.cardTitle}>{t('forecastOverview') || 'Overview'}</MysticalText>
                                </View>
                                <MysticalText style={styles.bodyText}>
                                    {activeInsight.description || activeInsight.overview}
                                </MysticalText>
                            </GlassCard>

                            {/* Deep Dives (Only render if new structure exists) */}
                            {activeInsight.career && (
                                <>
                                    <GlassCard style={styles.contentCard}>
                                        <View style={styles.cardHeader}>
                                            <Briefcase color={Colors.primary} size={20} />
                                            <MysticalText variant="h3" style={styles.cardTitle}>{t('forecastCareer') || 'Career & Wealth'}</MysticalText>
                                        </View>
                                        <MysticalText style={styles.bodyText}>{activeInsight.career}</MysticalText>
                                    </GlassCard>

                                    <GlassCard style={styles.contentCard}>
                                        <View style={styles.cardHeader}>
                                            <Heart color="#e87070" size={20} />
                                            <MysticalText variant="h3" style={styles.cardTitle}>{t('forecastLove') || 'Love & Connections'}</MysticalText>
                                        </View>
                                        <MysticalText style={styles.bodyText}>{activeInsight.love}</MysticalText>
                                    </GlassCard>

                                    <GlassCard style={styles.warningCard}>
                                        <View style={styles.cardHeader}>
                                            <AlertTriangle color="#ebb134" size={20} />
                                            <MysticalText variant="h3" style={styles.warningTitle}>{t('forecastWarning') || 'Oracle Warning'}</MysticalText>
                                        </View>
                                        <MysticalText style={styles.warningBody}>{activeInsight.oracleWarning}</MysticalText>
                                    </GlassCard>
                                </>
                            )}

                            {/* Lucky Days Footer */}
                            {activeInsight.luckyDays && activeInsight.luckyDays.length > 0 && (
                                <View style={styles.luckyDaysContainer}>
                                    <Star color={Colors.primary} size={16} />
                                    <MysticalText style={styles.luckyDaysText}>
                                        {(t('forecastLuckyDays') || 'Lucky Days:')} {activeInsight.luckyDays.join(', ')}
                                    </MysticalText>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles.cardsContainer}>
                            <GlassCard style={styles.contentCard}>
                                <MysticalText style={styles.bodyText}>
                                    {t('forecastPlaceholder') || 'Your insight will appear here.'}
                                </MysticalText>
                            </GlassCard>
                        </View>
                    )}
                </ScrollView>

                <Modal 
                    visible={isTimingModalVisible} 
                    animationType="slide" 
                    presentationStyle="pageSheet"
                    onRequestClose={() => setIsTimingModalVisible(false)}
                >
                    <SafeAreaView style={styles.modalBg}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setIsTimingModalVisible(false)}>
                                <MysticalText style={styles.modalCloseText}>{t('close') || 'Close'}</MysticalText>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <CosmicRoadmap birthdate={userProfile?.birthdate} />
                        </View>
                    </SafeAreaView>
                </Modal>
            </SafeAreaView>
        </GradientBackground>
    );
};

// Quick missing icon definitions internally since we can't easily add more to lucide via text if they aren't imported
const SparklesIcon = ({ color }: { color: string }) => <Compass color={color} size={20} />;

const ForecastPaywallOverlay = ({ onBack, navigation }: { onBack: () => void; navigation: any }) => {
    const { t } = useSettings();
    const openPaywall = () => {
        onBack();
        navigation.getParent()?.navigate('Paywall');
    };

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                <View style={styles.paywallContainer}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft color={Colors.textSecondary} size={24} />
                        <MysticalText style={styles.backText}>{t('oraclePaywallBack') || 'Back to Home'}</MysticalText>
                    </TouchableOpacity>

                    <View style={styles.paywallContent}>
                        <View style={styles.lockIconContainer}>
                            <Lock color={Colors.primary} size={50} />
                        </View>

                        <MysticalText variant="h2" style={styles.paywallTitle}>
                            {t('forecastPaywallTitle') || 'Unlock Your Forecast'}
                        </MysticalText>

                        <MysticalText style={styles.paywallSubtitle}>
                            {t('forecastPaywallSubtitle') || 'Start your free trial to discover your Personal Year and Month cosmic themes.'}
                        </MysticalText>

                        <View style={styles.offerContainer}>
                            <Button
                                title={t('startFreeTrial') || 'Start 3-Day Free Trial'}
                                onPress={openPaywall}
                                style={styles.paywallBtn}
                            />
                            <MysticalText variant="caption" style={styles.cancelText}>
                                {t('trialSubtext') || '3-day free trial'}
                            </MysticalText>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        gap: 12,
    },
    headerTitle: {
        fontSize: 28,
        color: Colors.primary,
    },
    segmentContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    segmentButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    segmentText: (isActive: boolean) => ({
        color: isActive ? Colors.text : Colors.textSecondary,
        fontWeight: isActive ? '600' : '400',
        fontSize: 15,
    }),
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    heroIcon: {
        marginBottom: 10,
        opacity: 0.8,
    },
    heroSubtitle: {
        fontSize: 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    heroNumber: {
        fontSize: 72,
        lineHeight: 85,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 10,
    },
    heroTitle: {
        fontSize: 22,
        textAlign: 'center',
        color: Colors.text,
        paddingHorizontal: 20,
    },
    cardsContainer: {
        gap: 16,
    },
    contentCard: {
        padding: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        color: Colors.primary,
    },
    bodyText: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.textSecondary,
        opacity: 0.9,
    },
    warningCard: {
        padding: 24,
        borderColor: 'rgba(235, 177, 52, 0.3)',
        borderWidth: 1,
        backgroundColor: 'rgba(235, 177, 52, 0.05)',
    },
    warningTitle: {
        fontSize: 18,
        color: '#ebb134',
    },
    warningBody: {
        fontSize: 15,
        lineHeight: 24,
        color: '#f0ce84', // Much lighter orange/yellow text
        opacity: 0.9,
        fontWeight: '500',
    },
    luckyDaysContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
        paddingVertical: 15,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    luckyDaysText: {
        fontSize: 15,
        color: Colors.text,
        fontWeight: '600',
        letterSpacing: 1,
    },
    // Paywall Styles
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
    paywallBtn: {
        width: '100%',
        marginBottom: 15,
    },
    cancelText: {
        opacity: 0.6,
    },
    modalBg: {
        flex: 1,
        backgroundColor: '#0a0612',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
    },
    modalCloseText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    modalContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
