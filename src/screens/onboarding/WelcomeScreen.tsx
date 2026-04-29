import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Button } from '../../components/ui/Button';
import { useSettings } from '../../context/SettingsContext';
import { usePostHog } from 'posthog-react-native';

interface WelcomeScreenProps {
    onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const { t } = useSettings();
    const posthog = usePostHog();

    useEffect(() => {
        if (posthog) {
            posthog.capture('onboarding_started');
        }
    }, [posthog]);

    const handleStart = () => {
        if (posthog) {
            posthog.capture('onboarding_step_completed', { step_name: 'welcome', step_number: 1 });
        }
        onStart();
    };

    return (
        <GradientBackground style={styles.container}>
            <View style={styles.content}>
                <View style={styles.symbolContainer}>
                    <Image
                        source={require('../../../assets/numrologyAI_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.titleBlock}>
                    <MysticalText variant="h1" style={styles.hookTitle}>
                        {t('welcomeHookTitle')}
                    </MysticalText>
                </View>

                <MysticalText variant="subtitle" style={styles.subtitle}>
                    {t('discoverSubtitle')}
                </MysticalText>
            </View>

            <View style={styles.footer}>
                <Button title={t('startYourJourney')} onPress={handleStart} />
                <MysticalText variant="caption" style={styles.poweredBy}>
                    {t('poweredBy')}
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
        width: 220,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    titleBlock: {
        marginBottom: 20,
        paddingHorizontal: 8,
        maxWidth: 360,
        alignSelf: 'center',
    },
    hookTitle: {
        textAlign: 'center',
        lineHeight: 34,
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
