import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/Colors';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { Sparkles, ChevronRight } from 'lucide-react-native';
import { AIService } from '../../services/ai';
import { useSettings } from '../../context/SettingsContext';
import { useUser } from '../../context/UserContext';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'> & {
    route: { params?: MainTabParamList['Home'] & { openDailyInsight?: boolean } }
};

export const HomeScreen: React.FC<Props> = ({ route, navigation }) => {
    const { language, t } = useSettings();
    const { userProfile, numerologyResults } = useUser();

    // Use context (persistent) data as primary, route.params as fallback for fresh navigation
    const name = userProfile?.name ?? route.params?.name ?? t('seeker');
    const lifePath = numerologyResults?.lifePath ?? route.params?.lifePath ?? 0;
    const destiny = numerologyResults?.destiny ?? route.params?.destiny ?? 0;
    const soulUrge = numerologyResults?.soulUrge ?? route.params?.soulUrge ?? 0;
    const personality = numerologyResults?.personality ?? route.params?.personality ?? 0;
    const personalYear = numerologyResults?.personalYear ?? route.params?.personalYear ?? 0;
    const dailyNumber = numerologyResults?.dailyNumber ?? route.params?.dailyNumber ?? 0;


    const [dailyInsight, setDailyInsight] = React.useState<string>(t('dailyInsight'));
    const [loadingInsight, setLoadingInsight] = React.useState(true);
    const scrollViewRef = React.useRef<ScrollView>(null);

    React.useEffect(() => {
        if (route.params?.openDailyInsight) {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    }, [route.params?.openDailyInsight]);

    React.useEffect(() => {
        const fetchInsight = async () => {
            const todayKey = new Date().toISOString().split('T')[0];
            const cacheKey = `daily_insight_${lifePath}_${language}_${todayKey}`;

            try {
                // Check cache first
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) {
                    setDailyInsight(cached);
                    setLoadingInsight(false);
                    return;
                }

                // If not cached, fetch from AI
                const insight = await AIService.getDailyInsight(lifePath, language);
                if (insight) {
                    setDailyInsight(insight);
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
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    // Numerical Mapping for the diagram
    const birthday = lifePath; // Simplified for now

    return (
        <GradientBackground>
            <SafeAreaView style={styles.safe}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    {/* Header Section */}
                    <View style={styles.header}>
                        <MysticalText style={styles.welcomeText}>Welcome back !!!</MysticalText>
                        <MysticalText variant="h1" style={styles.nameText}>{name || t('seeker')}</MysticalText>
                        <MysticalText style={styles.dateText}>{formattedDate}</MysticalText>
                    </View>

                    {/* Cosmic Message Section */}
                    <GlassCard style={styles.cosmicCard}>
                        <View style={styles.cosmicHeader}>
                            <Sparkles color={Colors.primary} size={18} />
                            <MysticalText variant="subtitle" style={styles.cosmicTitle}>{t('cosmicMessage')}</MysticalText>
                        </View>
                        <MysticalText variant="body" style={styles.cosmicContent}>
                            {loadingInsight ? t('consultingStars') : dailyInsight}
                        </MysticalText>
                    </GlassCard>

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

                    {/* YOUR NUMEROLOGY MAP Section */}
                    <View style={styles.section}>
                        <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('numerologyMap')}</MysticalText>
                        <GlassCard style={styles.mapContainer}>
                            <View style={styles.mapGraphic}>
                                {/* Central Core */}
                                <View style={styles.coreNode}>
                                    <View style={[styles.nodeCircle, styles.coreCircle]}>
                                        <MysticalText style={[styles.coreValue, { lineHeight: 40 }]}>{lifePath}</MysticalText>
                                    </View>
                                    <MysticalText variant="caption" style={styles.nodeLabel}>{t('core')}</MysticalText>
                                </View>

                                {/* Surrounding Nodes */}
                                <MapNode label={t('lifePath')} value={lifePath} angle={-90} color="#f1c40f" />
                                <MapNode label={t('destiny')} value={destiny} angle={30} color={Colors.secondary} />
                                <MapNode label={t('soulUrge')} value={soulUrge} angle={150} color="#3498db" />
                                <MapNode label={t('personality')} value={personality} angle={210} color="#e74c3c" />
                                <MapNode label={t('birthday')} value={birthday} angle={330} color="#2ecc71" />

                                {/* Connection Lines */}
                                <ConnectionLine angle={-90} />
                                <ConnectionLine angle={30} />
                                <ConnectionLine angle={150} />
                                <ConnectionLine angle={210} />
                                <ConnectionLine angle={330} />
                            </View>

                            <View style={styles.legend}>
                                <LegendItem color="#f1c40f" label={t('lifePath')} value={lifePath} />
                                <LegendItem color={Colors.secondary} label={t('destiny')} value={destiny} />
                                <LegendItem color="#3498db" label={t('soulUrge')} value={soulUrge} />
                                <LegendItem color="#e74c3c" label={t('personality')} value={personality} />
                                <LegendItem color="#2ecc71" label={t('birthday')} value={birthday} />
                            </View>
                        </GlassCard>
                    </View>

                    {/* Ask the Oracle Card */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Oracle', { lifePath, language })}
                    >
                        <GlassCard style={styles.oracleCTA}>
                            <View style={styles.oracleIconBox}>
                                <Sparkles color={Colors.primary} size={24} />
                            </View>
                            <View style={styles.oracleTextContent}>
                                <MysticalText variant="subtitle" style={styles.oracleTitle}>{t('askOracle')}</MysticalText>
                                <MysticalText variant="caption" style={styles.oracleSub}>{t('oracleSub')}</MysticalText>
                            </View>
                            <ChevronRight color={Colors.textSecondary} size={20} />
                        </GlassCard>
                    </TouchableOpacity>

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

const MapNode = ({ label, value, angle, color }: any) => {
    const radius = 80;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return (
        <View style={[styles.node, { transform: [{ translateX: x }, { translateY: y }] }]}>
            <View style={[styles.nodeCircle, { borderColor: color }]}>
                <MysticalText style={[styles.nodeValue, { lineHeight: 24 }]}>{value}</MysticalText>
            </View>
            <MysticalText variant="caption" style={styles.nodeLabel}>{label}</MysticalText>
        </View>
    );
};

const ConnectionLine = ({ angle }: { angle: number }) => {
    const radius = 40; // Starts from core edge
    const length = 40; // Length to reach outer nodes
    return (
        <View style={[
            styles.line,
            {
                transform: [
                    { rotate: `${angle}deg` },
                    { translateX: radius + length / 2 }
                ]
            }
        ]} />
    );
};

const LegendItem = ({ color, label, value }: any) => (
    <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <MysticalText variant="caption" style={styles.legendText}>{label}: {value}</MysticalText>
    </View>
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
        gap: 8,
        marginBottom: 10,
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
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    mapContainer: {
        paddingVertical: 30,
        alignItems: 'center',
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
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
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
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
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
    oracleCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 15,
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
