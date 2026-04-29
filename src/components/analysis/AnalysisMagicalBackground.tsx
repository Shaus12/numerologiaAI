import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const INDIGO_TOP = '#16102e';
const INDIGO_MID = '#0f0a22';
const INDIGO_DEEP = '#080614';

type StarSpec = { x: number; y: number; r: number; delay: number };

function makeStars(width: number, height: number): StarSpec[] {
    const list: StarSpec[] = [];
    const seeds = [
        [0.08, 0.12, 1.2],
        [0.22, 0.08, 1.8],
        [0.42, 0.05, 1.0],
        [0.58, 0.14, 1.4],
        [0.78, 0.09, 1.6],
        [0.92, 0.18, 1.1],
        [0.15, 0.28, 1.3],
        [0.35, 0.22, 1.0],
        [0.55, 0.26, 1.7],
        [0.72, 0.24, 1.2],
        [0.88, 0.32, 1.4],
        [0.06, 0.42, 1.0],
        [0.28, 0.38, 1.5],
        [0.48, 0.44, 1.1],
        [0.65, 0.4, 1.8],
        [0.84, 0.46, 1.2],
        [0.12, 0.55, 1.3],
        [0.38, 0.52, 1.0],
        [0.52, 0.58, 1.6],
        [0.75, 0.54, 1.1],
        [0.94, 0.62, 1.4],
        [0.2, 0.68, 1.2],
        [0.45, 0.72, 1.0],
        [0.62, 0.66, 1.7],
        [0.82, 0.74, 1.3],
        [0.1, 0.82, 1.1],
        [0.32, 0.88, 1.5],
        [0.58, 0.84, 1.2],
        [0.78, 0.9, 1.0],
        [0.5, 0.15, 2.0],
        [0.25, 0.62, 1.4],
        [0.68, 0.12, 1.2],
        [0.9, 0.52, 1.0],
        [0.4, 0.78, 1.6],
        [0.14, 0.18, 1.0],
        [0.86, 0.28, 1.3],
    ];
    for (let i = 0; i < seeds.length; i++) {
        const [nx, ny, r] = seeds[i];
        list.push({
            x: nx * width,
            y: ny * height,
            r,
            delay: i * 120,
        });
    }
    return list;
}

function TwinkleStar({ x, y, r, delay }: StarSpec) {
    const o = useSharedValue(0.2);

    useEffect(() => {
        o.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(0.85, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
                    withTiming(0.25, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
                ),
                -1,
                false,
            ),
        );
    }, [delay, o]);

    const style = useAnimatedStyle(() => ({
        opacity: o.value,
    }));

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.star,
                {
                    left: x,
                    top: y,
                    width: r * 2,
                    height: r * 2,
                    borderRadius: r,
                },
                style,
            ]}
        />
    );
}

function GeometryPulse() {
    const rot = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        rot.value = withRepeat(
            withTiming(360, { duration: 48000, easing: Easing.linear }),
            -1,
            false,
        );
        scale.value = withRepeat(
            withSequence(
                withTiming(1.04, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
                withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            false,
        );
    }, [rot, scale]);

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rot.value}deg` }, { scale: scale.value }],
        opacity: 0.12,
    }));

    const ring2Style = useAnimatedStyle(() => ({
        transform: [{ rotate: `${-rot.value * 0.7}deg` }, { scale: scale.value * 0.92 }],
        opacity: 0.08,
    }));

    return (
        <View style={styles.geometryWrap} pointerEvents="none">
            <Animated.View style={[styles.hexRing, ringStyle]} />
            <Animated.View style={[styles.hexRing, styles.hexRingInner, ring2Style]} />
        </View>
    );
}

export const AnalysisMagicalBackground: React.FC = () => {
    const { width, height } = useWindowDimensions();
    const stars = makeStars(width, height);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <LinearGradient
                colors={[INDIGO_TOP, INDIGO_MID, INDIGO_DEEP]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={['rgba(212, 175, 55, 0.07)', 'transparent', 'rgba(75, 50, 120, 0.12)']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <GeometryPulse />
            {stars.map((s, i) => (
                <TwinkleStar key={i} {...s} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    star: {
        position: 'absolute',
        backgroundColor: '#e8d9a8',
    },
    geometryWrap: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hexRing: {
        position: 'absolute',
        width: 420,
        height: 420,
        borderRadius: 210,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.35)',
    },
    hexRingInner: {
        width: 320,
        height: 320,
        borderRadius: 160,
        borderColor: 'rgba(147, 112, 219, 0.25)',
    },
});
