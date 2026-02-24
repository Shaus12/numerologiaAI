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
                    <Image
                        source={require('../../../assets/numrologyAI_logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.titleRow}>
                    <MysticalText variant="h1" style={styles.title}>{t('discoverTitle')}</MysticalText>
                    <MysticalText variant="h1" style={styles.titleAccent}>{t('discoverTitleAccent')}</MysticalText>
                    <MysticalText variant="h1" style={styles.title}>{t('discoverTitleEnd')}</MysticalText>
                </View>

                <MysticalText variant="subtitle" style={styles.subtitle}>
                    {t('discoverSubtitle')}
                </MysticalText>
            </View>

            <View style={styles.footer}>
                <Button title={t('startYourJourney')} onPress={onStart} />
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
    titleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
    },
    titleAccent: {
        color: Colors.secondary,
        textAlign: 'center',
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
