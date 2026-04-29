import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { AnalysisMagicalBackground } from '../../components/analysis/AnalysisMagicalBackground';
import { Colors } from '../../constants/Colors';
import { useSettings } from '../../context/SettingsContext';
import { RootStackParamList } from '../../navigation/types';
import { persistOnboardingResumeForPaywall } from '../../utils/onboardingResumeStorage';

const PULSE_MS = 2800;

type Props = NativeStackScreenProps<RootStackParamList, 'LoadingAnalysis'>;

export const LoadingAnalysisScreen: React.FC<Props> = ({ navigation }) => {
    const { t, isRTL } = useSettings();
    const statusMessages = useMemo(
        () => [
            t('loadingAnalysisStep1'),
            t('loadingAnalysisStep2'),
            t('loadingAnalysisStep3'),
            t('loadingAnalysisStep4'),
        ],
        [t],
    );

    const [messageIndex, setMessageIndex] = useState(0);

    const orbGlow = useSharedValue(0.55);
    const orbCore = useSharedValue(0.45);
    const labelOpacity = useSharedValue(0);

    useEffect(() => {
        orbGlow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.sin) }),
                withTiming(0.52, { duration: PULSE_MS, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false,
        );
        orbCore.value = withRepeat(
            withSequence(
                withTiming(1, { duration: PULSE_MS * 1.05, easing: Easing.inOut(Easing.sin) }),
                withTiming(0.48, { duration: PULSE_MS * 1.05, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false,
        );
        // Orb loop runs once; shared values are stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fadeOutMs = messageIndex === 0 ? 0 : 220;
        labelOpacity.value = withSequence(
            withTiming(0, { duration: fadeOutMs }),
            withTiming(1, { duration: 420 }),
        );
    }, [messageIndex]);

    useEffect(() => {
        void persistOnboardingResumeForPaywall();
    }, []);

    useEffect(() => {
        let step = 0;
        const id = setInterval(() => {
            step += 1;
            if (step < statusMessages.length) {
                setMessageIndex(step);
            } else {
                clearInterval(id);
                navigation.replace('Analysis');
            }
        }, 1000);
        return () => clearInterval(id);
    }, [navigation, statusMessages.length]);

    const orbOuterStyle = useAnimatedStyle(() => ({
        opacity: 0.12 + orbGlow.value * 0.42,
        transform: [{ scale: 0.92 + orbGlow.value * 0.14 }],
    }));

    const orbMidStyle = useAnimatedStyle(() => ({
        opacity: 0.18 + orbCore.value * 0.5,
        transform: [{ scale: 0.88 + orbCore.value * 0.12 }],
    }));

    const orbInnerStyle = useAnimatedStyle(() => ({
        opacity: 0.35 + (orbGlow.value + orbCore.value) * 0.22,
        transform: [{ scale: 0.82 + orbGlow.value * 0.1 }],
    }));

    const labelStyle = useAnimatedStyle(() => ({
        opacity: labelOpacity.value,
    }));

    return (
        <View style={styles.root}>
            <AnalysisMagicalBackground />
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <View style={styles.center}>
                    <View style={styles.orbWrap}>
                        <Animated.View style={[styles.orbOuter, orbOuterStyle]} pointerEvents="none" />
                        <Animated.View style={[styles.orbMid, orbMidStyle]} pointerEvents="none" />
                        <Animated.View style={[styles.orbInner, orbInnerStyle]} pointerEvents="none" />
                    </View>

                    <Animated.Text
                        style={[styles.statusText, labelStyle, isRTL && styles.statusTextRtl]}
                        numberOfLines={2}
                    >
                        {statusMessages[messageIndex]}
                    </Animated.Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#080614',
    },
    safe: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    orbWrap: {
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    orbOuter: {
        position: 'absolute',
        width: 132,
        height: 132,
        borderRadius: 66,
        backgroundColor: Colors.primary,
    },
    orbMid: {
        position: 'absolute',
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(255, 236, 190, 0.55)',
    },
    orbInner: {
        position: 'absolute',
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255, 248, 220, 0.85)',
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.65,
                shadowRadius: 18,
            },
            android: { elevation: 12 },
        }),
    },
    statusText: {
        color: 'rgba(232, 224, 255, 0.92)',
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
        fontWeight: '500',
        letterSpacing: 0.2,
        minHeight: 52,
        unicodeBidi: 'plaintext',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif-medium' },
        }),
    },
    statusTextRtl: {
        writingDirection: 'rtl',
    },
});
