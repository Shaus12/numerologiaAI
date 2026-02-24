import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Colors } from '../../constants/Colors';

interface SplashScreenProps {
    onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [progress] = useState(new Animated.Value(0));
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start(() => {
            setTimeout(onFinish, 500);
        });

        const listener = progress.addListener(({ value }) => {
            setPercent(Math.floor(value * 100));
        });

        return () => progress.removeListener(listener);
    }, []);

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <GradientBackground style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../assets/numrologyAI_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <View style={styles.footer} pointerEvents="none">
                <View style={styles.progressBarBg}>
                    <Animated.View style={[styles.progressBarFilled, { width: progressWidth }]} />
                </View>
                <MysticalText variant="caption" style={styles.loadingText}>
                    Downloading {percent}%
                </MysticalText>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 220,
        height: 220,
        marginBottom: 20,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '80%',
        alignItems: 'center',
    },
    progressBarBg: {
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 1,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFilled: {
        height: '100%',
        backgroundColor: Colors.primary,
    },
    loadingText: {
        color: Colors.textSecondary,
    },
});
