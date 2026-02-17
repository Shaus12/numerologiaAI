import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MysticalText } from '../ui/MysticalText';

interface OnboardingHeaderProps {
    step: number;
    totalSteps: number;
    onBack?: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ step, totalSteps }) => {
    const progress = (step / totalSteps) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <MysticalText variant="caption" style={styles.stepText}>
                    STEP {step} OF {totalSteps}
                </MysticalText>
                <MysticalText variant="caption" style={styles.progressText}>
                    {Math.round(progress)}%
                </MysticalText>
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
        paddingTop: 60,
        marginBottom: 30,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    stepText: {
        fontWeight: '700',
        letterSpacing: 2,
        color: Colors.primary,
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
