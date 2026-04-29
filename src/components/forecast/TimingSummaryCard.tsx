import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { MysticalText } from '../ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { useSettings } from '../../context/SettingsContext';

interface TimingSummaryCardProps {
    onPress: () => void;
}

export const TimingSummaryCard: React.FC<TimingSummaryCardProps> = ({ onPress }) => {
    const { t, textDirection } = useSettings();
    const isRtl = textDirection === 'rtl';

    // Hardcoded for now per task
    const year = "2026";
    const alignment = 60;
    const theme = `${t('zodiacHorse') || 'Year of the Horse'} - ${t('timingThemeDefault') || 'Building Foundations'}`;

    return (
        <Pressable 
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} 
            onPress={onPress}
        >
            <View style={[styles.topRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.titleWrap, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <Calendar color={Colors.primary} size={16} />
                    <MysticalText style={styles.title}>
                        {isRtl ? `${t('timingStrategy')} ${year}` : `${year} ${t('timingStrategy')}`}
                    </MysticalText>
                </View>
                <View style={[styles.scoreWrap, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <MysticalText style={styles.scoreText}>{alignment}%</MysticalText>
                    <ChevronRight color={Colors.primary} size={16} style={isRtl ? { transform: [{ rotate: '180deg'}] } : undefined} />
                </View>
            </View>
            
            <View style={styles.bottomRow}>
                <MysticalText style={[styles.themeText, { textAlign: isRtl ? 'right' : 'left' }]}>{theme}</MysticalText>
            </View>

            <View style={[styles.progressTrack, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                <View style={[styles.progressFill, { width: `${alignment}%` }]} />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)', // subtle gold border
    },
    cardPressed: {
        opacity: 0.8,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    scoreWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    scoreText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '700',
    },
    bottomRow: {
        marginBottom: 12,
    },
    themeText: {
        color: Colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
    },
    progressTrack: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
});
