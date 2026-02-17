import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { NumerologyEngine } from '../../utils/numerology';
import { AIService } from '../../services/ai';

interface CalculatingScreenProps {
    userData: {
        name: string;
        birthdate: string;
        language: string;
    };
    onFinish: (results: any) => void;
}

const STEPS = [
    'Aligning planetary energies...',
    'Decoding your Life Path...',
    'Extracting Soul Urge...',
    'Consulting the Oracle...',
    'Finalizing your blueprint...'
];

export const CalculatingScreen: React.FC<CalculatingScreenProps> = ({ userData, onFinish }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [spinValue] = useState(new Animated.Value(0));

    useEffect(() => {
        // Rotation animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Step progression
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
        }, 1500);

        // Parallel calculations and AI generation
        const process = async () => {
            const lifePath = NumerologyEngine.calculateLifePath(userData.birthdate);
            const destiny = NumerologyEngine.calculateDestiny(userData.name);
            const soulUrge = NumerologyEngine.calculateSoulUrge(userData.name);
            const personality = NumerologyEngine.calculatePersonality(userData.name);
            const personalYear = NumerologyEngine.calculatePersonalYear(userData.birthdate);
            const dailyNumber = NumerologyEngine.calculateDailyNumber(personalYear);

            const reading = await AIService.generateReading({
                name: userData.name,
                birthdate: userData.birthdate,
                lifePath,
                destiny,
                soulUrge,
                personality,
                language: userData.language
            });

            // Ensure we stay on screen for at least a few seconds for effect
            setTimeout(() => {
                onFinish({
                    name: userData.name,
                    reading,
                    lifePath,
                    destiny,
                    soulUrge,
                    personality,
                    language: userData.language,
                    personalYear,
                    dailyNumber
                });
            }, 6000);
        };

        process();

        return () => {
            clearInterval(interval);
            spinValue.stopAnimation();
        };
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <GradientBackground style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.loaderContainer, { transform: [{ rotate: spin }] }]}>
                    <View style={styles.outerCircle} />
                    <View style={styles.innerCircle} />
                    <View style={styles.dot} />
                </Animated.View>

                <MysticalText variant="h2" style={styles.title}>
                    Calculating...
                </MysticalText>
                <MysticalText variant="body" style={styles.stepText}>
                    {STEPS[stepIndex]}
                </MysticalText>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    loaderContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    outerCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        position: 'absolute',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: Colors.secondary,
        opacity: 0.5,
        position: 'absolute',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        position: 'absolute',
        top: 0,
    },
    title: {
        marginBottom: 10,
    },
    stepText: {
        color: Colors.textSecondary,
        fontStyle: 'italic',
    }
});
