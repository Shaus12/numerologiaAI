import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { MysticalText } from '../ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { Compass, Star } from 'lucide-react-native';
import { NumerologyEngine } from '../../utils/numerology';
import { PersonalYearInsights } from '../../data/forecastData';
import { useSettings } from '../../context/SettingsContext';

interface CosmicRoadmapProps {
    birthdate?: string;
    lifePathNumber?: number;
}

const ProgressBar = ({ score, color, isRtl }: { score: number, color: string, isRtl: boolean }) => {
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(widthAnim, {
            toValue: score,
            useNativeDriver: false,
            tension: 40,
            friction: 7,
        }).start();
    }, [score]);

    return (
        <View style={[styles.progressTrack, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <Animated.View 
                style={[
                    styles.progressFill, 
                    { 
                        backgroundColor: color,
                        width: widthAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%']
                        })
                    }
                ]} 
            />
        </View>
    );
};

export const CosmicRoadmap: React.FC<CosmicRoadmapProps> = ({ birthdate, lifePathNumber }) => {
    const { t, language, textDirection } = useSettings();
    const isRtl = textDirection === 'rtl';

    const lpn = useMemo(() => {
        if (lifePathNumber) return lifePathNumber;
        if (birthdate) return NumerologyEngine.calculateLifePath(birthdate);
        return 1; // Fallback
    }, [birthdate, lifePathNumber]);

    const years = [2025, 2026, 2027];
    const zodiacMap: Record<number, string> = {
        2025: t('zodiacSnake') || 'שנת הנחש',
        2026: t('zodiacHorse') || 'שנת הסוס',
        2027: t('zodiacGoat') || 'שנת העז'
    };

    const roadmapData = years.map(year => {
        const py = NumerologyEngine.calculateRoadmapPersonalYear(lpn, year);
        const harmony = NumerologyEngine.getHarmonyScore(lpn, py);
        let color = '#ef4444'; // Red for < 40
        if (harmony >= 70) color = '#22c55e'; // Green
        else if (harmony >= 40) color = '#f59e0b'; // Orange
        
        return {
            year,
            zodiac: zodiacMap[year] || '',
            py,
            harmony,
            color,
            description: PersonalYearInsights[language]?.[py]?.overview || PersonalYearInsights['English']?.[py]?.overview || ''
        };
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Compass color={Colors.primary} size={38} style={styles.headerIcon} />
                <MysticalText variant="h1" style={styles.mainTitle}>{t('cosmicRoadmapTitle') || 'עיתוי קוסמי נחשף'}</MysticalText>
                <MysticalText style={styles.subtitle}>
                    {t('cosmicRoadmapSubtitle') || 'דע מתי לפעול בעוצמה, מתי להמתין ומתי לשמור על פרופיל נמוך.'}
                </MysticalText>
            </View>

            {/* Yearly Roadmap Cards */}
            <View style={styles.cardsContainer}>
                {roadmapData.map((data, index) => (
                    <View key={data.year} style={styles.yearCard}>
                        <View style={[styles.cardHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                            <View>
                                <MysticalText variant="h2" style={[styles.yearText, { textAlign: isRtl ? 'right' : 'left' }]}>{data.year}</MysticalText>
                                <MysticalText style={[styles.zodiacText, { textAlign: isRtl ? 'right' : 'left' }]}>{data.zodiac}</MysticalText>
                            </View>
                            <View style={styles.scoreBadge}>
                                <MysticalText style={[styles.scoreText, { color: data.color }]}>{data.harmony}%</MysticalText>
                                <MysticalText style={styles.scoreLabel}>{t('harmonyScoreLabel') || 'התאמה'}</MysticalText>
                            </View>
                        </View>

                        <ProgressBar score={data.harmony} color={data.color} isRtl={isRtl} />
                        
                        <View style={[styles.pyBadge, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                            <Star color={Colors.primary} size={14} />
                            <MysticalText style={styles.pyLabel}>{t('personalYearPrefix') || 'שנה אישית'} {data.py}</MysticalText>
                        </View>

                        <MysticalText style={[styles.descText, { textAlign: isRtl ? 'right' : 'left' }]} numberOfLines={4}>
                            {data.description}
                        </MysticalText>
                    </View>
                ))}
            </View>

            {/* Daily Timing Row */}
            <View style={[styles.dailySection, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.dailyDay}>
                    <MysticalText style={styles.dailyTitle}>{t('dayYesterday') || 'אתמול'}</MysticalText>
                    <MysticalText style={styles.dailySub}>23</MysticalText>
                    <MysticalText style={styles.dailyDesc}>{t('roadmapDescYesterday') || 'שיעור חדש'}</MysticalText>
                </View>

                <View style={[styles.dailyDay, styles.dailyToday]}>
                    <MysticalText style={styles.dailyTitleActive}>{t('dayToday') || 'היום'}</MysticalText>
                    <MysticalText style={styles.dailySubActive}>24</MysticalText>
                    <MysticalText style={styles.dailyDescActive}>{t('roadmapDescToday') || 'יום מושלם לדייט'}</MysticalText>
                </View>

                <View style={styles.dailyDay}>
                    <MysticalText style={styles.dailyTitle}>{t('dayTomorrow') || 'מחר'}</MysticalText>
                    <MysticalText style={styles.dailySub}>25</MysticalText>
                    <MysticalText style={styles.dailyDesc}>{t('roadmapDescTomorrow') || 'זמן למשפחה'}</MysticalText>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    content: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 12,
    },
    headerIcon: {
        marginBottom: 16,
    },
    mainTitle: {
        fontSize: 26,
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    cardsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    yearCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    cardHeader: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    yearText: {
        fontSize: 24,
        color: Colors.text,
        textAlign: 'right',
    },
    zodiacText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'right',
        marginTop: 2,
    },
    scoreBadge: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    progressTrack: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 3,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row-reverse', // Fill from right (Hebrew)
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    pyBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    pyLabel: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '600',
    },
    descText: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 22,
        opacity: 0.9,
        textAlign: 'right',
    },
    dailySection: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dailyDay: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    dailyToday: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderColor: Colors.primary,
        transform: [{ scale: 1.05 }],
    },
    dailyTitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    dailyTitleActive: {
        fontSize: 15,
        color: Colors.primary,
        marginBottom: 4,
        fontWeight: '600',
    },
    dailySub: {
        fontSize: 22,
        color: Colors.text,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    dailySubActive: {
        fontSize: 24,
        color: Colors.text,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    dailyDesc: {
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    dailyDescActive: {
        fontSize: 12,
        color: Colors.primary,
        textAlign: 'center',
        fontWeight: '500',
    },
});
