import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { MysticalText } from '../ui/MysticalText';
import { useSettings } from '../../context/SettingsContext';

interface OnboardingHeaderProps {
    step: number;
    totalSteps: number;
    onBack?: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ step, totalSteps, onBack }) => {
    const { t } = useSettings();
    const insets = useSafeAreaInsets();
    const progress = (step / totalSteps) * 100;

    return (
        <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
            <View style={styles.topRow}>
                {onBack ? (
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backBtn}
                        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                        activeOpacity={0.6}
                    >
                        <ChevronLeft color={Colors.primary} size={28} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.backBtn} />
                )}
                <MysticalText variant="caption" style={styles.stepText}>
                    {t('stepLabel')} {step} {t('ofLabel')} {totalSteps}
                </MysticalText>
                <View style={styles.progressRight}>
                    <MysticalText variant="caption" style={styles.progressText}>
                        {Math.round(progress)}%
                    </MysticalText>
                </View>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    backBtn: {
        minWidth: 44,
        minHeight: 44,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: -15, // Offset the padding so the icon still aligns to the left edge
    },
    stepText: {
        fontWeight: '700',
        letterSpacing: 2,
        color: Colors.primary,
    },
    progressRight: {
        width: 40,
        alignItems: 'flex-end',
    },
    progressText: {
        fontWeight: '700',
        color: Colors.textSecondary,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
});
