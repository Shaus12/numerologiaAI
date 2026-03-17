import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
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
    const progress = (step / totalSteps) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                {onBack ? (
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <ChevronLeft color={Colors.primary} size={28} />
                    </Pressable>
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
        paddingTop: 60,
        marginBottom: 30,
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
        justifyContent: 'center',
        alignItems: 'flex-start',
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
