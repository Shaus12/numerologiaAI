import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

type LifePathKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const GOLD_SOFT = 'rgba(255, 250, 235, 0.94)';
const GOLD_SHADOW = 'rgba(212, 175, 55, 0.42)';

export const LifePathEmblem: React.FC<{ lifePath: LifePathKey; lifePathCaption: string }> = ({
    lifePath,
    lifePathCaption,
}) => {
    const glow = useSharedValue(0.55);

    useEffect(() => {
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
                withTiming(0.5, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false,
        );
    }, [glow]);

    const haloStyle = useAnimatedStyle(() => ({
        opacity: 0.32 + glow.value * 0.28,
        transform: [{ scale: 0.98 + glow.value * 0.05 }],
    }));

    const auraOuter = useAnimatedStyle(() => ({
        opacity: 0.06 + glow.value * 0.14,
        transform: [{ scale: 1 + glow.value * 0.04 }],
    }));

    const auraMid = useAnimatedStyle(() => ({
        opacity: 0.1 + (1 - glow.value) * 0.16,
        transform: [{ scale: 0.96 + (1 - glow.value) * 0.05 }],
    }));

    const auraInner = useAnimatedStyle(() => ({
        opacity: 0.08 + glow.value * 0.12,
        transform: [{ scale: 0.94 + glow.value * 0.04 }],
    }));

    const digitBloomStyle = useAnimatedStyle(() => {
        const r = 20 + glow.value * 16;
        const a = 0.22 + glow.value * 0.2;
        return {
            textShadowRadius: r,
            textShadowColor: `rgba(255, 245, 215, ${a})`,
            textShadowOffset: { width: 0, height: 0 },
        };
    });

    const digitSheenStyle = useAnimatedStyle(() => ({
        opacity: 0.18 + glow.value * 0.22,
        transform: [{ scale: 1.04 + glow.value * 0.02 }],
    }));

    return (
        <View style={styles.wrap}>
            <Animated.View style={[styles.haloOuter, haloStyle]} />
            <View style={styles.haloMid}>
                <View style={styles.innerContent}>
                    <View style={styles.digitCluster}>
                        <Animated.View style={[styles.auraRing, styles.auraRingLg, auraOuter]} pointerEvents="none" />
                        <Animated.View style={[styles.auraRing, styles.auraRingMd, auraMid]} pointerEvents="none" />
                        <Animated.View style={[styles.auraRing, styles.auraRingSm, auraInner]} pointerEvents="none" />
                        <Animated.Text
                            style={[styles.digitBloom, digitSheenStyle]}
                            allowFontScaling={false}
                            pointerEvents="none"
                        >
                            {String(lifePath)}
                        </Animated.Text>
                        <Animated.Text
                            style={[styles.digit, digitBloomStyle]}
                            allowFontScaling
                            maxFontSizeMultiplier={1.15}
                        >
                            {String(lifePath)}
                        </Animated.Text>
                    </View>
                    <Text style={styles.caption} allowFontScaling maxFontSizeMultiplier={1.1} numberOfLines={2}>
                        {lifePathCaption}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        width: 172,
        height: 172,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    haloOuter: {
        position: 'absolute',
        width: 156,
        height: 156,
        borderRadius: 78,
        backgroundColor: 'rgba(212, 175, 55, 0.18)',
    },
    haloMid: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 1.5,
        borderColor: 'rgba(248, 226, 139, 0.38)',
        backgroundColor: 'rgba(8, 6, 20, 0.42)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    innerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingBottom: 2,
    },
    digitCluster: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 58,
    },
    auraRing: {
        position: 'absolute',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.38)',
        backgroundColor: 'transparent',
    },
    auraRingLg: {
        width: 108,
        height: 108,
        borderRadius: 54,
    },
    auraRingMd: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderColor: 'rgba(255, 236, 180, 0.28)',
    },
    auraRingSm: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderColor: 'rgba(248, 226, 139, 0.35)',
    },
    digitBloom: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 56,
        fontWeight: '100',
        color: GOLD_SHADOW,
        letterSpacing: -2,
        lineHeight: 60,
        zIndex: 0,
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif-thin' },
        }),
    },
    digit: {
        textAlign: 'center',
        fontSize: 52,
        fontWeight: '200',
        color: GOLD_SOFT,
        letterSpacing: -2,
        lineHeight: 56,
        zIndex: 1,
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif-thin' },
        }),
    },
    caption: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.8,
        color: 'rgba(232, 218, 180, 0.85)',
        textAlign: 'center',
        ...Platform.select({
            ios: { fontFamily: 'Avenir Next' },
            android: { fontFamily: 'sans-serif' },
        }),
    },
});
