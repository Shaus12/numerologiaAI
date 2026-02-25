import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { GradientBackground } from '../../components/shared/GradientBackground';
import { MysticalText } from '../../components/ui/MysticalText';
import { Colors } from '../../constants/Colors';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useSettings } from '../../context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsOfUse'>;

const APPLE_EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';

export const TermsOfUseScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useSettings();

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                        activeOpacity={0.7}
                        hitSlop={{ top: 32, bottom: 32, left: 32, right: 32 }}
                    >
                        <ArrowLeft color="#fff" size={26} />
                    </TouchableOpacity>
                    <MysticalText variant="h2" style={styles.headerTitle}>{t('termsOfUse')}</MysticalText>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <MysticalText variant="body" style={styles.paragraph}>{t('termsOfUseIntro')}</MysticalText>
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('termsOfUseEulaTitle')}</MysticalText>
                    <TouchableOpacity onPress={() => Linking.openURL(APPLE_EULA_URL)} activeOpacity={0.7}>
                        <MysticalText variant="body" style={[styles.paragraph, styles.link]}>{t('termsOfUseEulaLink')}</MysticalText>
                    </TouchableOpacity>
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('termsOfUseAcceptTitle')}</MysticalText>
                    <MysticalText variant="body" style={styles.paragraph}>{t('termsOfUseAcceptBody')}</MysticalText>
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('termsOfUseServiceTitle')}</MysticalText>
                    <MysticalText variant="body" style={styles.paragraph}>{t('termsOfUseServiceBody')}</MysticalText>
                    <MysticalText variant="subtitle" style={styles.sectionTitle}>{t('termsOfUseContactTitle')}</MysticalText>
                    <MysticalText variant="body" style={[styles.paragraph, styles.lastParagraph]}>{t('termsOfUseContactBody')}</MysticalText>
                </ScrollView>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginBottom: 24,
    },
    backBtn: {
        padding: 20,
        minWidth: 64,
        minHeight: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    headerTitle: { flex: 1, textAlign: 'center' },
    headerSpacer: { width: 64 },
    content: { paddingHorizontal: 24, paddingBottom: 48 },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 10,
        color: Colors.primary,
    },
    paragraph: {
        lineHeight: 24,
        opacity: 0.92,
        marginBottom: 8,
    },
    link: {
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
    lastParagraph: { marginBottom: 32 },
});
