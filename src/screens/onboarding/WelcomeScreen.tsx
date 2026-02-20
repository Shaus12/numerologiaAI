import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { useSettings } from '../../context/SettingsContext';

interface WelcomeScreenProps {
    onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const { t } = useSettings();

    return (
        <GradientBackground style={styles.container}>
            <View style={styles.content}>
                <View style={styles.symbolContainer}>
                    {/* This would be a mystical circle SVG or Image */}
                    <View style={styles.circle} />
                </View>

                <MysticalText variant="h1" style={styles.title}>
                    Discover what the {'\n'}
                    <MysticalText variant="h1" color={Colors.secondary}>numbers</MysticalText> say about {'\n'}
                    your destiny.
                </MysticalText>

                <MysticalText variant="subtitle" style={styles.subtitle}>
                    Unlock your cosmic blueprint with AI-powered numerology analysis.
                </MysticalText>
            </View>

            <View style={styles.footer}>
                <Button title="Start Your Journey" onPress={onStart} />
                <MysticalText variant="caption" style={styles.poweredBy}>
                    POWERED BY ADVANCED AI
                </MysticalText>
                <MysticalText variant="caption" style={styles.disclaimer}>
                    {t('disclaimer')}
                </MysticalText>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        paddingTop: 100,
        paddingBottom: 50,
    },
    content: {
        alignItems: 'center',
    },
    symbolContainer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    circle: {
        width: '100%',
        height: '100%',
        borderRadius: 125,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        opacity: 0.5,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    footer: {
        width: '100%',
    },
    poweredBy: {
        textAlign: 'center',
        marginTop: 20,
        opacity: 0.6,
        letterSpacing: 2,
    },
    disclaimer: {
        textAlign: 'center',
        marginTop: 15,
        opacity: 0.4,
        fontSize: 10,
        paddingHorizontal: 20,
    }
});
