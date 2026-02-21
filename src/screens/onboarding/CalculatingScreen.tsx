import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { NumerologyEngine } from '../../utils/numerology';
import { AIService } from '../../services/ai';
import { useUser } from '../../context/UserContext';

interface CalculatingScreenProps {
    userData: {
        name: string;
        birthdate: string;
        language: string;
        [key: string]: any;
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
    const { saveUserProfile, saveNumerologyResults } = useUser();

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
            try {
                if (!userData || !userData.birthdate || !userData.name) {
                    console.error('Missing mandatory userData for calculation:', userData);
                    // If we are missing critical data, we can't calculate. 
                    // Let's at least allow a fallback or just wait for timeout.
                }

                const lifePath = NumerologyEngine.calculateLifePath(userData.birthdate || new Date().toISOString());
                const destiny = NumerologyEngine.calculateDestiny(userData.name || 'Seeker');
                const soulUrge = NumerologyEngine.calculateSoulUrge(userData.name || 'Seeker');
                const personality = NumerologyEngine.calculatePersonality(userData.name || 'Seeker');
                const personalYear = NumerologyEngine.calculatePersonalYear(userData.birthdate || new Date().toISOString());
                const dailyNumber = NumerologyEngine.calculateDailyNumber(personalYear);

                let reading = "Your celestial blueprint is being prepared...";
                try {
                    reading = await AIService.generateReading({
                        name: userData.name || 'Seeker',
                        birthdate: userData.birthdate || new Date().toISOString(),
                        lifePath,
                        destiny,
                        soulUrge,
                        personality,
                        language: userData.language || 'English'
                    });
                } catch (aiError) {
                    console.error('AI Reading Error:', aiError);
                    // Continue with default reading if AI fails
                }

                const results = {
                    lifePath,
                    destiny,
                    soulUrge,
                    personality,
                    reading,
                    personalYear,
                    dailyNumber
                };

                // Save to persistence
                try {
                    await saveUserProfile(userData);
                    await saveNumerologyResults(results);
                } catch (saveError) {
                    console.error('Data Save Error:', saveError);
                }

                // Ensure we stay on screen for at least a few seconds for effect
                setTimeout(() => {
                    onFinish({
                        name: userData.name || 'Seeker',
                        ...results,
                        language: userData.language || 'English',
                    });
                }, 6000);
            } catch (error) {
                console.error('CRITICAL CALCULATION ERROR:', error);
                // Last resort: escape hatch to allow user to continue even with errors
                setTimeout(() => {
                    onFinish(null);
                }, 8000);
            }
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
                <Animated.View
                    style={[styles.loaderContainer, { transform: [{ rotate: spin }] }]}
                    pointerEvents="none"
                >
                    <View style={styles.outerCircle} pointerEvents="none" />
                    <View style={styles.innerCircle} pointerEvents="none" />
                    <View style={styles.dot} pointerEvents="none" />
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
